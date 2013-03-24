I'm still interested in choosing random values in a not-entirely-random way.
Previously I wanted to weight a set of known options and choose from them --
essentially forcing a distribution curve. But now, I want to choose a random
value that has some relation to previously-chosen random values: based on a
history of previous choices and their membership in defined value-sets. This
has interesting implications in generating "random" notes in a musical
synthesis application that I'll leave to the reader to suss out.


As an example, let's say I want to pick a sequence of numbers from the range 1
to 15 inclusive. I'll first create a bunch of Value Sets into which qualifying
numbers can be assigned. For example:

```
 odds = { 1 3 5 7 9 13 15 }
 evens = { 2 4 6 8 10 12 14 }
 mod3 = { 3 6 9 12 15 }
```

Now, I'll dig into my history of previously-chosen values, and get the most
recent N. For each previous value, I'll figure out which Value Sets they were a
member of, and tally that membership. Let's say N=2, then:

```
 previous random number = 15: odds, mod3
 previous random number = 6: evens, mod3
 final tally: odds=1, events=1, mod3=2
```

Whichever Value Set had the most tallies (or a random choice between the
highest-ranking, if there are more than one) becomes the set I pick from
randomly this time. So, now I take a random value from the mod3 set.

Let's say it was 9. On the next computation, I'll get membership tallies (with
N=2) of odds=2, mod3=2, ensuring a relatively low likelihood (~16% chance) of
choosing an even number, and a relatively high likelyhood (~66%) of choosing a
multiple of 3. Which is what we want, given that the "history" of numbers (9,
15) are both odd and divisible by 3.

Sketching that up in C++ is a fun little exercise in templates.

```
template<typename T>
class SetChooser
{
public:
    SetChooser(size_t i_history_depth)
    : m_history_depth(i_history_depth)
    {
        //
    }

    ~SetChooser()
    {
        //
    }

    typedef std::set<T> ValueSet;
    void add_value_set(const ValueSet& i_value_set)
    {
        m_value_sets.push_back(i_value_set);
    }

    T choose()
    {
        // tally set membership for each value in the history, and calculate highest tally count
        std::vector<size_t> tallies(m_value_sets.size(), 0);
        size_t tally_max(0);
        for (typename std::vector<T>::const_iterator it = m_history.begin() ; it != m_history.end() ; ++it)
        {
            size_t i(0);
            for (typename std::vector<ValueSet>::const_iterator it2 = m_value_sets.begin() ;
                 it2 != m_value_sets.end() ; ++it2, ++i)
            {
                if (it2->find(*it) != it2->end())
                {
                    tallies[i]++;
                    if (tallies[i] > tally_max)
                    {
                        tally_max = tallies[i];
                    }
                }
            }
        }

        // sets with the highest tally count pass to the next round, to be chosen from
        std::vector<size_t> winning_sets;
        for (size_t i = 0 ; i < tallies.size() ; ++i)
        {
            if (tallies[i] == tally_max)
            {
                winning_sets.push_back(i);
            }
        }

        // choose a random set from the winning sets
        std::random_shuffle(winning_sets.begin(), winning_sets.end());
        const ValueSet& winning_set(m_value_sets[*winning_sets.begin()]);

        // choose a random value from the winning set
        size_t random(rand() % winning_set.size());
        typename ValueSet::iterator choice;
        for (choice = winning_set.begin() ; choice != winning_set.end() && random > 0 ; ++choice, --random);
        T t( *choice );

        // add that value to our history, resize history, and return
        m_history.push_back(t);
        while (m_history.size() > m_history_depth)
        {
            m_history.erase(m_history.begin());
        }
        return t;
    }

private:
    const size_t m_history_depth;
    std::vector<T> m_history;
    std::vector<ValueSet> m_value_sets;
};
```

This gives us delightfully coordinated random values:

```
$ ./setchooser
usage: setchooser <history depth> <num choices>

$ ./setchooser 2 20
15 15 3 12 6 3 15 15 7 13 15 7 15 1 3 11 15 9 15 3
```

