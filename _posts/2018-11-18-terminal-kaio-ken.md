---
layout: post
title:  "Terminal Kaio-Ken"
date:   2017-11-18
# category: guide
tags: [system]
---

In this post, I wish to elaborate on my command-line terminal setup and share what I believe is a productive, highly-utilitarian and not to mention gorgeous terminal experience. As a computer scientist/engineer, I spent more time using the terminal than a regular GUI. And if you're Unix oriented like me, you will know that using the terminal is so much more efficient and nimble than using the mouse.

To begin with, I have eschewed the standard Bash shell in favor of the much more powerful ZSH shell. ZSH offers much more comprehensive file globbing and auto-complete features than Bash and is really nifty in how it uses its history to recall old commands you may wish to repeat. I highly recommend going through this [slide-deck](http://www.slideshare.net/jaguardesignstudio/why-zsh-is-cooler-than-your-shell-16194692) to gain an understanding of what ZSH can accomplish for you.

However, ZSH on its own is not enough. To really make our experience amazing, let me introduce you to the delightful [Oh-My-ZSH](http://ohmyz.sh/), a community-driven project  which provides plugin and themes for the ZSH shell, and boy are they useful. To install ZSH, use the instructions [here](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH) and for OMZ, all you need to do is run:

```shell
# An easy shell script to install Oh-My-ZSH. I use the wget version since it is more ubiquitous.
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

Now time for some styling! If you are a Dragon Ball Z fan like myself and some of my friends, the title of this post will bring back a lot of memories, specifically, this meme -

<img src="http://i0.kym-cdn.com/entries/icons/original/000/000/056/itsover1000.jpg" alt="vegeta" height="289" />

The theme I most prefer is [`powerlevel9k`](https://github.com/bhilburn/powerlevel9k). Based on the `Powerline` theme, it combines functionality with a good dose of fanciness, while making a nice little reference to a beloved anime character. Installing it though is not as straightforward as the above steps have been. To install the theme,  we first have to download it and add it to the right folder:
```shell
$ git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/custom/themes/powerlevel9k
```
Then, we open up the `~/.zshrc` file and specify the theme
```shell
ZSH_THEME="powerlevel9k/powerlevel9k"
```
This uses the basic Oh-My-ZSH framework to install the theme, though you are more than welcome to use Antigen or ZPM if you are aware of them.

At this point, if you open your terminal, you may find some glaring deficiencies. This is because we haven't yet set up the powerline fonts needed to render all the smooth jazz of this theme. Let's do that. First we download the latest versions of the symbol font and the fontconfig files:

```shell
wget https://github.com/powerline/powerline/raw/develop/font/PowerlineSymbols.otf
wget https://github.com/powerline/powerline/raw/develop/font/10-powerline-symbols.conf
```

After this we need to create the font folder to store these files and create the font cache

```shell
mkdir ~/.fonts
```

We can now move the font file to the above folder

```shell
mv PowerlineSymbols.otf ~/.fonts/
```

and generate the font-cache

```shell
fc-cache -vf ~/.fonts/
```

*Note* you may have to provide root privileges for the above step.

Finally, install the font config file:

```shell
mv 10-powerline-symbols.conf ~/.config/fontconfig/conf.d/
```

Now that we have the powerline fonts set up, restart your terminal. Doesn't it look fabulous?

If you want a more fully featured font set for a developer, I recommend checking out Adobe's `Source Code Pro` and the `Hack` font. To install, just copy the fonts to the `~/.fonts` directory and run `fc-cache -fv`

If the theme seems a bit off, for example the arrows aren't quite aligned, this is mostly a problem with your terminal emulator. Go to the terminal emulator's preferences and select the Hack or Source Code Pro theme and it should be fixed.

But wait, there's more! Since we've already made this much progress, why not go one more step ahead and add some amazing font icons from FontAwesome? This can be easily accomplished using the instructions [here](https://github.com/gabrielelana/awesome-terminal-fonts#how-to-install-linux). I am not specifying them verbatim here since the repository is still undergoing active development and the install instructions are subject to change in the near future.

Your terminal should now look something like this:

<img class="alignnone size-full wp-image-756" src="https://computercalledvarun.files.wordpress.com/2017/01/screenshot-from-2017-01-17-225604.png" alt="screenshot-from-2017-01-17-225604" width="1355" height="27" />

I generally dislike redundancy and useless information. Seeing my name on the prompt is exactly that, so why I not eschew it in favor of more meaningful information such as what Python virtualenv is currently active, or what Ruby version you are using? Let's do that.

In your `~/.zshrc`, you have to add some minor commands custom to `powerlvl9k`. These are:

```shell
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon dir vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(virtualenv pyenv rvm rbenv go_version nvm status history time)
```

It should be pretty straightforward to understand what each item in the parentheses corresponds to. This is my setup, so feel free to omit things you don't need. You can checkout what prompt elements are available [here](https://github.com/bhilburn/powerlevel9k#available-prompt-segments). While you're there, be sure to look up how to stylize your prompt as well to get your creative juices flowing.

Finally, this is what you get:<img class="alignnone  wp-image-774" src="https://computercalledvarun.files.wordpress.com/2017/01/terminal.png" alt="terminal" width="5355" height="15" />

As a closing thought, one very useful OMZ plugin I use is `zsh-syntax-highlighting` which updates the color of the terminal text when it is correct, thus ensuring your commands are valid before you hit enter. This plugin can easily be installed using the plugins list in the `~/.zshrc` and specifying the plugin exactly as above in the parentheses.

I hope you enjoy your new super-saiyan terminal experience. If you don't particularly like it, the `Oh-My-ZSH` page has dozens of themes to choose from, and if you have the time, you can go ahead and create your own theme.

Eviva!