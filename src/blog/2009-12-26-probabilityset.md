{ "title": "ProbabilitySet" }
---
I'm interested in randomly choosing an object from a set of objects, but with
non-uniform probabilities that I can set. I wrote a simple helper class to do
this naïvely:

```
template<typename T>
class ProbabilitySet
{
public:
    ProbabilitySet() { }
    virtual ~ProbabilitySet() { }

    void add(const T& i_thing, int i_weight)
    {
        if (i_weight > 0)
        {
            size_t pos(m_things.size());
            m_things.push_back(i_thing);
            for (int i = 0 ; i < i_weight ; ++i)
            {
                m_weighted_things.push_back(pos);
            }
        }
    }

    T get() const
    {
        int r(rand() % m_weighted_things.size());
        const size_t& pos(m_weighted_things.at(r));
        return m_things.at(pos);
    }

private:
    std::vector<T> m_things;
    std::vector<size_t> m_weighted_things;
};
```

It's used by injecting a series of objects into it with 'weights', which are
interpreted additively. For example,

```
ProbabilitySet<std::string> ps;
ps.add("alpha", 1);
ps.add("beta", 2);
ps.add("delta", 1);
```

Calls to ps.get() will return beta ~50% of the time, and alpha or delta ~25% of
the time. It seems reasonably fast in practice -- I've made the conscious
decision to waste a little space in duplicating data (actually, pointers to
data) so that I can have fast lookups, rather than saving space by implementing
something like 'ranges' but having lookups take considerably more time. This
also has the advantage of being pretty conceptually simple. But I'm curious if
anyone has any ideas for optimization? I suppose I could precompute
`m_weighted_things.size()` with each `add()`. Any other thoughts?

edit: fixed nasty, stupid bug I overlooked: when vectors get resized there's no
guarantee the old memory locations will be the same as the new ones, so gets
occasionally returned bogus data when enough adds were made to force a resize.
