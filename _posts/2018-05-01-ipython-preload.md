---
layout: post
title:  "Loading Modules to IPython on Startup"
date:   2018-05-01
# category: guide
tags: [python, hack, guide]
---

Whenever I start `IPython` in a terminal, I always need to import my favorite modules before I can begin working. This is always a hassle these days due to the redundancy of the task, so let's automate that as well!

## IPython Profile

The key idea here is to go to your IPython profile and set up the actions you wish to run at startup. Your profile can be located at `~/.ipython/profile_default` on Linux (you may have to do some google searching for your OS). This is the default IPython profile. There you should find a directory `startup` which has a `README` file in it. 

## Startup Script

You can read the `README` in the `startup` directory if you want, but all it says is that any `.py` and `.ipy` files in this directory will be executed by the Python interpreter before the prompt shows us. Kinda what we want, right?

Simply put a python file in this directory with the needed code. I put a file called `pre.py` (you can name the file whatever you want) with the following contents:

```python
import numpy as np
import scipy as scp
import torch
import torchvision
```

And voila! You should be able to now open an `IPython` prompt and directly work with your modules. 

Doing the above for your default profile is sufficient, though you can create a custom profile if you wish, depending on the project and other things.
