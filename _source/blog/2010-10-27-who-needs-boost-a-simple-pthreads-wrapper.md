template: blog/entry.template
title: Who needs boost? A simple pthreads wrapper.
---

I wrote a critique of boost::threads, with some sample wrapper code, a few
years ago. It's served me well in several projects since then, but something's
always bugged me about it. Since boost::threads are such a thin wrapper around
plain ol' pthreads (in Linux, at least) I thought the boost dependency was
actually not so necessary.

Turns out I was right. Today I was working on something that I didn't want to
drag boost into, and hacked out a simple pthread wrapper that provides the same
API as the boost::thread wrapper. It's very slightly less safe, and not as
tested (I've only run it through a few benchmarks today). But, maybe it will be
useful to someone. Probably it will just be me. That's fine.

So, first up, we have the threadbase class:

```
#include <pthread.h>

class threadbase;
static void * threadbase_dispatcher(void *arg)
{
	threadbase *tb(static_cast<threadbase *>(arg));
	tb->run();
	return NULL;
}

class threadbase
{
public:
    threadbase() : m_threadbase_ptr(NULL) { }
    virtual ~threadbase() { }
    
    void start()
    {
        if (m_threadbase_ptr == NULL) {
            m_threadbase_ptr = new pthread_t;
            int rc = pthread_create(m_threadbase_ptr, NULL, threadbase_dispatcher, this);
            if (rc != 0) {
                throw std::runtime_error("threadbase pthread_create failed");
            }
        } else {
            throw std::runtime_error("multiple threadbase start");
        }
    }
    
    void join()
    {
        if (m_threadbase_ptr) {
            int rc = pthread_join(*m_threadbase_ptr, NULL);
            if (rc != 0) {
                throw std::runtime_error("threadbase pthread_join failed");
            }
            delete m_threadbase_ptr;
            m_threadbase_ptr = NULL;
        }
    }
    
    virtual void run() = 0;
    
private:
    pthread_t *m_threadbase_ptr;
    
};
```

(I avoid member function pointer headaches by using a free function to act as a
dispatcher.) And to go with it, the monitor:

```
class monitor
{
protected:
    pthread_mutex_t monitor_mutex;
    pthread_cond_t monitor_condition;

public:
    monitor()
    {
        if (pthread_mutex_init(&monitor_mutex, NULL) != 0) {
            throw std::runtime_error("couldn't initialize Monitor mutex");
        }
        if (pthread_cond_init(&monitor_condition, NULL) != 0) {
            throw std::runtime_error("couldn't initialize Monitor condition");
        }
    }
    
    virtual ~monitor() { }
    
    void wait()
    {
        pthread_cond_wait(&monitor_condition, &monitor_mutex);
    }
    
    #define NSEC_IN_MSEC 1000000
    #define NSEC_IN_SEC 1000000000
    #define MSEC_IN_SEC 1000
    bool monitor::timed_wait_ms(int i_duration_ms)
    {
        struct timeval now;
        gettimeofday(&now, NULL);
        struct timespec delay;
        delay.tv_sec  = now.tv_sec + i_duration_ms / MSEC_IN_SEC;
        delay.tv_nsec = now.tv_usec*1000 + (i_duration_ms % MSEC_IN_SEC) * NSEC_IN_MSEC;
        if (delay.tv_nsec >= NSEC_IN_SEC) {
            delay.tv_nsec -= NSEC_IN_SEC;
            delay.tv_sec++;
        }
        int rc = pthread_cond_timedwait(&monitor_condition, &monitor_mutex, &delay);
        return rc == 0;
    }
    
    void notify_one()
    {
        pthread_cond_signal(&monitor_condition);
    }
    
    void notify_all()
    {
        pthread_cond_broadcast(&monitor_condition);
    }
};
```

If you see any bugs, please let me know!
