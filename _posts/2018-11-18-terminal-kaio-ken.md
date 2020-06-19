---
layout: post
title:  "Terminal Kaio-Ken"
date:   2017-11-18
# category: guide
tags: [system, guide]
---

In this post, I wish to elaborate on my command-line terminal setup and share what I believe is a productive, highly-utilitarian and not to mention gorgeous terminal experience. As a computer scientist/engineer, I spend more time using the terminal than a regular GUI, and if you're Unix oriented like me, you will know that using the terminal is so much more efficient and nimble than using the mouse.

To begin with, I have eschewed the standard Bash shell in favor of the much more powerful ZSH shell. ZSH offers much more comprehensive file globbing and auto-complete features than Bash and is really nifty in how it uses its history to recall old commands you may wish to repeat. I highly recommend going through this [slide-deck](https://www.slideshare.net/jaguardesignstudio/why-zsh-is-cooler-than-your-shell-16194692) to gain an understanding of what ZSH can accomplish for you.

However, ZSH on its own is not enough. To really make our experience amazing, let me introduce you to the delightful [Oh-My-ZSH](https://ohmyz.sh/), a community-driven project  which provides plugin and themes for the ZSH shell, and boy are they useful.

To install ZSH, use the instructions [here](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH) for your particular OS/distro.

For OMZ, all you need to do is run:

```bash
# An easy shell script to install Oh-My-ZSH. I use the wget version since it is more ubiquitous.
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

Now time for some styling! If you are a Dragon Ball Z fan like myself and some of my friends, the title of this post will bring back a lot of memories, specifically, this meme -

<img src="https://i0.kym-cdn.com/entries/icons/original/000/000/056/itsover1000.jpg" alt="vegeta" height="289" />

The theme I prefer is [`powerlevel9k`](https://github.com/Powerlevel9k/powerlevel9k). Based on the `Powerline` theme, it combines functionality with a good dose of fanciness, while making a nice little reference to a beloved anime character. A new and improved version called [`powerlevel10k`](https://github.com/romkatv/powerlevel10k) has now been released and is the recommended theme.

Installing it is pretty straightforward. We first have to clone it and add it to the right folder:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k
```

Then, we open up the `~/.zshrc` file and specify the theme

```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
```

This uses the basic Oh-My-ZSH framework to install the theme, though you are more than welcome to use Antigen or ZPM if you are aware of them.

At this point, if you open your terminal, you should have a fully functioning console them. `powerlevel10k` picks up on prior `powerlevel9k` options and works out of the box. You can further customize the theme to your preferences by running `p10k configure` in the terminal. An interactive program will take you through a series of choices (and explain them) and you can feel free to run this configuration as many times as desired until you are satisfied.

We can supplement the theme by installing a bunch of cool font styles and glyphs via `nerd-fonts`. Installing `nerd-fonts` is a piece of cake. All you need to do is go to the [github repository](https://github.com/ryanoasis/nerd-fonts), download the repo and unzip it somewhere convenient. Enter the unzipped directory and run the install script

```bash
./install.sh
```

This will take a while since it installs all of the fonts and glyphs to your system, but it is totally worth it. However, if you wish to be bit more frugal, the README has a section on how to install specific fonts (my recommendations are `Hack` and `mononoki`).

Restart your terminal and it should now look something like this:

<img class="alignnone size-full" src="/images/powerlevel10k_theme.png" alt="powerlevel10k screenshot" />

You can modify the file `~/.p10k.zsh` to customize the powertrain information. For example, the two variables you should look for are `POWERLEVEL9K_LEFT_PROMPT_ELEMENTS` and `POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS` and you can uncomment whatever options you like. The defaults work well for me, and provide meaningful information such as what Python virtualenv is currently active, or what Ruby version is active.

It should be pretty straightforward to understand what each item in the parentheses corresponds to. This is my setup, so feel free to omit things you don't need. You should also definitely check out the project's [`README.md`](https://github.com/romkatv/powerlevel10k/blob/master/README.md) for a host of information about the various options as well as what various symbols mean.

As a closing thought, one very useful OMZ plugin I use is `zsh-syntax-highlighting` which updates the color of the terminal text when it is correct, thus ensuring your commands are valid before you hit `enter`. This plugin can easily be installed using the plugins list in the `~/.zshrc` and specifying the plugin exactly as above in the parentheses.

I hope you enjoy your new super-saiyan terminal experience. If you don't particularly like it, the `Oh-My-ZSH` page has dozens of themes to choose from, and if you have the time, you can go ahead and create your own theme.

Eviva!