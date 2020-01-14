---
layout: post
title:  "Terminal Kaio-Ken"
date:   2017-11-18
# category: guide
tags: [system, guide]
---

In this post, I wish to elaborate on my command-line terminal setup and share what I believe is a productive, highly-utilitarian and not to mention gorgeous terminal experience. As a computer scientist/engineer, I spent more time using the terminal than a regular GUI. And if you're Unix oriented like me, you will know that using the terminal is so much more efficient and nimble than using the mouse.

To begin with, I have eschewed the standard Bash shell in favor of the much more powerful ZSH shell. ZSH offers much more comprehensive file globbing and auto-complete features than Bash and is really nifty in how it uses its history to recall old commands you may wish to repeat. I highly recommend going through this [slide-deck](https://www.slideshare.net/jaguardesignstudio/why-zsh-is-cooler-than-your-shell-16194692) to gain an understanding of what ZSH can accomplish for you.

However, ZSH on its own is not enough. To really make our experience amazing, let me introduce you to the delightful [Oh-My-ZSH](https://ohmyz.sh/), a community-driven project  which provides plugin and themes for the ZSH shell, and boy are they useful. To install ZSH, use the instructions [here](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH) and for OMZ, all you need to do is run:

```bash
# An easy shell script to install Oh-My-ZSH. I use the wget version since it is more ubiquitous.
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

Now time for some styling! If you are a Dragon Ball Z fan like myself and some of my friends, the title of this post will bring back a lot of memories, specifically, this meme -

<img src="https://i0.kym-cdn.com/entries/icons/original/000/000/056/itsover1000.jpg" alt="vegeta" height="289" />

The theme I most prefer is [`powerlevel9k`](https://github.com/bhilburn/powerlevel9k). Based on the `Powerline` theme, it combines functionality with a good dose of fanciness, while making a nice little reference to a beloved anime character. Installing it though is not as straightforward as the above steps have been. To install the theme,  we first have to download it and add it to the right folder:

```bash
$ git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/custom/themes/powerlevel9k
```

Then, we open up the `~/.zshrc` file and specify the theme

```bash
ZSH_THEME="powerlevel9k/powerlevel9k"
```

This uses the basic Oh-My-ZSH framework to install the theme, though you are more than welcome to use Antigen or ZPM if you are aware of them.

At this point, if you open your terminal, you may find some glaring deficiencies. This is because we haven't yet set up the powerline fonts needed to render all the smooth jazz of this theme. The `powerlevel9k` Wiki suggests downloading the `PowerlineSymbols` font and configuring it yourself. I have found this approach to be buggy and hard to fix on most occasions especially alongwith `FontAwesome` glyphs. Instead, the best way I have found to fix this as well as install a bunch of cool font styles and glyphs at the same time is to use `nerd-fonts`.

Installing `nerd-fonts` is a piece of cake. ALl you need to do is go to the [github repository](https://github.com/ryanoasis/nerd-fonts), download the repo and unzip it somewhere convenient. Enter the unzipped directory and run the install script

```bash
./install.sh
```

This will take a while since it installs all of the fonts and glyphs to your system, but it is totally worth it. However, if you wish to be bit more frugal, the README has a section on how to install specific fonts (my recommendations are `Hack` and `mononoki`). While the fonts are installing, we can go ahead and tell ZSH that we are using the `nerd-fonts` fonts by adding this line right above the `ZSH_THEME` line:

```bash
POWERLEVEL9K_MODE='nerdfont-complete'
```

Restart your terminal and it should now look something like this:

<img class="alignnone size-full wp-image-756" src="https://computercalledvarun.files.wordpress.com/2017/01/screenshot-from-2017-01-17-225604.png" alt="screenshot-from-2017-01-17-225604" width="1355" height="27" />

I generally dislike redundancy and useless information. Seeing my name on the prompt is exactly that, so why I not eschew it in favor of more meaningful information such as what Python virtualenv is currently active, or what Ruby version you are using? Let's do that.

In your `~/.zshrc`, you have to add some minor commands custom to `powerlvl9k`. These are:

```bash
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon dir vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(virtualenv pyenv rvm rbenv go_version nvm status history time)
```

It should be pretty straightforward to understand what each item in the parentheses corresponds to. This is my setup, so feel free to omit things you don't need. You can checkout what prompt elements are available [here](https://github.com/bhilburn/powerlevel9k#available-prompt-segments). While you're there, be sure to look up how to stylize your prompt as well to get your creative juices flowing.

Finally, this is what you get:<img class="alignnone  wp-image-774" src="https://computercalledvarun.files.wordpress.com/2017/01/terminal.png" alt="terminal" width="5355" height="15" />

As a closing thought, one very useful OMZ plugin I use is `zsh-syntax-highlighting` which updates the color of the terminal text when it is correct, thus ensuring your commands are valid before you hit enter. This plugin can easily be installed using the plugins list in the `~/.zshrc` and specifying the plugin exactly as above in the parentheses.

I hope you enjoy your new super-saiyan terminal experience. If you don't particularly like it, the `Oh-My-ZSH` page has dozens of themes to choose from, and if you have the time, you can go ahead and create your own theme.

Eviva!