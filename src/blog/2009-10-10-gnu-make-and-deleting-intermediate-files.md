{ "title": "GNU make and deleting intermediate files" }
---

Over the months and years I've developed a pretty useful Makefile template that
I like to use with any C++ project that exceeds a couple files. It's not super-
powerful but it has the advantage of being easily understandable, and I value
maintainability and readability pretty highly. I structure my project like:

```
 include/
   Constants.h
   MyClass.h
   MyOtherClass.h

 src/
   MyClass.cpp
   MyOtherClass.cpp
   my_executable_name.cpp

 obj/
   *initially empty*

 bin/
   my_executable_name

 third-party/
   some_library/
     lib/
     include/

 test/
    test_1.cpp
    test_2.cpp
```

Then, the Makefile can work pretty well like this:

```
CC = g++
OPT = -Wall -ggdb

OBJ = \
    obj/MyClass.o \
    obj/MyOtherClass.o

INC = -I./include -I./third-party/boost/include/boost-1_37 -I./third-party/other_library/include
LIB = -L./third-party/boost/lib -lboost_thread-xgcc40-mt -L./third-party/other_library/lib -lsomethingelse

MY_EXECUTABLE = bin/my_executable_name

TEST = \
    test/test_1 \
    test/test_2

default: $(MY_EXECUTABLE)

obj/%.o: src/%.cpp include/%.h
    $(CC) -c $(OPT) $(INC) -o $@ $<

bin/%: src/%.cpp $(OBJ)
    $(CC) $(OPT) $(INC) $(LIB) -o $@ $^

test/%: test/%.cpp
    $(CC) $(OPT) $(INC) $(LIB) -o $@ $^

all: $(MY_EXECUTABLE) $(TEST) Makefile

clean:
    rm -f $(OBJ) $(MY_EXECUTABLE) $(TEST)

test: $(TEST)
```

But make has this little thing where it likes to delete what it considers
'intermediate' files after it's done doing whatever it's doing. In my case, I
have make automatically generate the object files, so whenever I run a build it
destroys them afterwards. Reading up on it, it seems like somebody in maketown
decided that was a good tradeoff: that they had to sacrifice build efficiency
for correctness. I'm not sure how correctness would be affected if they kept
those object files around, but maybe that's why I'm not on the make team. In the
meanwhile, I've found a workaround: you need to mark your object files as
"precious", like so:

```
.PRECIOUS: obj/%.o
obj/%.o: src/%.cpp include/%.h
    $(CC) -c $(OPT) $(INC) -o $@ $<
```

This prevents them from being deleted, but also apparently may cause problems if
the build is interrupted. I trust you are smart enough to `make clean ; make` in
that situation.
