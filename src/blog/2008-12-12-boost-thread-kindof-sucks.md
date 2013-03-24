{ "title": "boost::thread kindof sucks" }
---

boost::thread is a (supposedly) powerful, clean, and otherwise good thread
library for C++. I don't know. It's okay. But it's pretty non-condusive to good
object-oriented design, mostly due to its (frankly, stupid) decision to deal in
Callables (eg. functions) rather than an instance of some "runnable" class (as
in Java threads, for example).

I've read Kempf's rationale, but it's not convincing. For me, dealing with
functors and function pointers in my app code is irritating and potentially
dangerous. And as far as I can tell I'm about the only one on the internet that
feels that way, because searching for "boost thread wrapper" is a meaningless
exercise. [Try it out for yourself][1]. So, allow me to post the fruits of my
labors.

[1]: http://google.com/search?q=boost+thread+wrapper

The idea here is we want some base Thread class that encapsulates all the thread
management and presents a very simple API to the user. We want to start our
thread, have it run some member function, and (later, when it's finished) we can
call join() on it to clean up. For sure we don't want to have to type "boost"
anywhere in our app code. So, here is that base class:

```
#include <boost/thread.hpp>
#include <boost/lambda/bind.hpp>

class ThreadBase
{
private:
    boost::shared_ptr<boost::thread> m_thread_ptr;

public:
    ThreadBase() : m_thread_ptr() { }
    virtual ~ThreadBase() { }

    virtual void run() = 0;

    void start()
    {
        if (m_thread_ptr == NULL)
        {
            m_thread_ptr.reset(
                new boost::thread(
                    boost::lambda::bind(&ThreadBase::run, this)));
        }
        else
        {
            throw std::runtime_error("multiple start");
        }
    }

    void join()
    {
        if (m_thread_ptr)
        {
            m_thread_ptr->join();
        }
    }
};
```

Now, we can make simple, useful threads without having to deal with too much
bullshit.

```
class MyThread : public ThreadBase
{
public:
    void run()
    {
        std::cout << "Zug zug" << std::endl;
    }
};

int main()
{
    MyThread mt;
    mt.start();
    mt.join();
    return 0;
}
```

That's pretty trivial. Almost immediately after you get useful threads, you want
useful thread synchronization. And again, boost::thread sort of fails. You get a
mutex (good!) but, instead of a monitor, you get a condition class to build your
own. It's like going to a bakery and being forced to ice your own cupcake. I
didn't go to that bakery to fuck up the icing on my dessert, I could have done
that at home. I want the complete cupcake, that's why I went to the bakery.
Well, I want actually useful primitives from my thread library, I don't want
boost-namespaced wrappers around the shit pthreads already gives me. We're
writing C++ here, not C. We want to make life easier, safer, and more
productive. Thus, the Monitor:

```
#include <boost/thread/mutex.hpp>
#include <boost/thread/condition.hpp>

class Monitor
{
protected:
    boost::mutex monitor_mutex;
    boost::condition monitor_condition;

public:
    Monitor() { }
    virtual ~Monitor() { }

    void wait()
    {
        monitor_condition.wait(monitor_mutex);
    }

    bool timed_wait_ms(int i_duration_ms)
    {
        boost::xtime::xtime_nsec_t total_ns(i_duration_ms * 1000000);
        boost::xtime::xtime_sec_t seconds(total_ns / 1000000000);
        boost::xtime::xtime_nsec_t remainder_ns(total_ns % 1000000000);

        boost::xtime xt;
        boost::xtime_get(&xt, boost::TIME_UTC);
        xt.sec += seconds;
        xt.nsec += remainder_ns;
        return monitor_condition.timed_wait(monitor_mutex, xt);
    }

    void notify_one()
    {
        monitor_condition.notify_one();
    }

    void notify_all()
    {
        monitor_condition.notify_all();
    }

    typedef boost::mutex::scoped_lock Synchronize;

};
```

To make a block of code synchronized, you can simply put a Synchronize
sync(monitor_mutex); at the entry point. Now we can combine our ThreadBase with
our Monitor to get a synchronized thread, which may actually do useful work.

```
class MyWorker : public ThreadBase, public Monitor
{
private:
    bool m_running;
    Resource* m_resource;

public:
    MyWorker(Resource* i_resource) : m_running(false), m_resource(i_resource) { }

    virtual void run()
    {
        Synchronize sync(monitor_mutex);
        m_running = true;
        while (m_running && m_resource != NULL)
        {
            m_resource->more_work(); // presumably Resource is threadsafe
            timed_wait_ms(1000);
        }
    }

    void stop()
    {
        Synchronize sync(monitor_mutex);
        m_running = false;
        notify_all();
    }
};
```

* (edit: fixed ThreadBase::join)
* (edit: fixed shared_ptr formatting)
* (edit: fixed Monitor destructor)