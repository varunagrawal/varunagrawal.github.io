---
layout: post
title:  "Quickstart On Profiling C++ Programs"
date:   2024-11-06
tags: [cpp, profiling]
---

I've been working with C++ a lot for my PhD, and part of my work involves writing performant C++ code which can be used across various processors.
This is particularly true in robotics, where both memory and compute can be limited resources.

So how does one handle investigating potential memory leaks and CPU slowdowns? Turns out a lot of people have this problem and have built a host of tools to tackle this. [Valgrind](https://valgrind.org/) seems to be the most popular toolkit, but for the sake of cross-platform ease and reporting, I decided to go with [Google's Gperftools](https://github.com/gperftools/gperftools).

## Installing Gperftools

Installation of Gperftools is actually quite easy if you're on a Unix based system, like Linux or MacOS. We can simply use Homebrew:

```sh
brew install google-perftools graphviz ghostscript
```

We also install `graphviz` and `ghostscript` to help with report generation. This is something I really like about Gperftools since it allows me to visualize graphically what is happening under the hood, rather than pore over thousands of lines of logs or print statements.

For Debian systems, you could also use `apt`, but I like using `brew` for various reasons, particularly cross-platform scripting.

## Linking with CMake

Since any non-trivial C++ program would use a build system and I prefer using `CMake`, it is imperative to show how to link Gperftools via CMake.

Within the `CMakeLists.txt` file, we first need to find the required library. Gperftools has two main libraries for heap and CPU profiling that need to be linked:

```cmake
find_library(GPERFTOOLS_TCMALLOC NAMES tcmalloc)
find_library(GPERFTOOLS_PROFILER NAMES profiler)
```

**NOTE**: You can provide `HINTS` to the `find_library` function to point it to the path where the libraries are located.

Once the system finds them, it is then just a simple matter of linking them (the CMake version of `-l<library>`):

```cmake
target_link_libraries(${PROJECT_NAME} ${GPERFTOOLS_TCMALLOC} ${GPERFTOOLS_PROFILER})
```

## pprof Setup

This is where I found things a bit difficult. `pprof` is now developed using `golang`, so it required me to install `Go` so I could install `pprof` with

```go
go install github.com/google/pprof@latest
```

Even with the new development process, some features and options of `pprof` didn't seem to work for me. More on that when we show how to use it.

## Profiling

This is the easy part!
Linking the above libraries causes the executable to have the necessary information, but the design of `Gperftools` is such that it won't actually log any profiling data unless we set some environment variables.

This is great desgin since you can have your executables always linked to the libraries for no extra penalty in performance. However, if you are using your system in production, it is advised to not link the libraries in case the environment variables are accidentally set.

For our use case, we can set the environment variables and call the executable as:

```sh
CPUPROFILE=./<cpuprof-dir>/cpuprof HEAPPROFILE=./<heapprof-dir>/heapprof ./<executable>
```

Here `CPUPROFILE` tells Gperftools where to store the CPU profiler data (in this case `<cpuprof-dir>`) with the filename pattern as `cpuprof`.
Similarly, `HEAPPROFILE` tells it where to store the heap profiling data with the filename pattern `heapprof` (e.g. `./<heapprof-dir>/heapprof.0001.heap`).

The above command will run the executable and Gperftools will do what is needed to collect the necessary information.

## Analyzing Profiles

For me, the easiest way to analyze the profiler information has been to render it as a PDF. This can be easily achieved with

```sh
pprof -pdf <executable> <cpuprof-dir>/cpuprof  > cpuprof.pdf
pprof -pdf <executable> <heapprof-dir>/heapprof.0001.heap  > heapprof.0001.pdf
```

And there you have it! You can now open those PDF files and view the nice graphical representation of all the function calls, the call frequency, memory usage, etc.

Some things to be wary of though, I initially had some difficulty with `pprof`:
- Everything other than the `golang` version would not work, or would throw random errors.
- Passing the flag for PNG files `-png` instead of `-pdf` refused to work. This could be a missing library but I couldn't find anything online, and PDF rendering worked great, so c'est la vie.
- On newer MacOS systems, you'll probably get a ton of errors thrown at you from a tool called `otool-classic`. This is a **red herring**, since the PDF will still render, and the errors stem from Apple's new approach to packaging libraries as _text-based-descriptions_ or TBDs instead of having multiple copies of the `.dylib` files.

## Conclusion

I hope this guide has been useful. I primarily have written it as a reference for my future self to inevitably come back to, and not spend a whole weekend figuring out stuff.
This way I can focus on analyzing the performance of my code rather than having to deal with system incompatibilities.

On a positive note, I managed to figure out an issue in my code which was causing the heap to blow up to > 40 GB. Now my code takes a modest 9 MB to run (~10,000x improvement!), so a big win for profiling.