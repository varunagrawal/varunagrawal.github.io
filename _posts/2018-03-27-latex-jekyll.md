---
layout: post
title: "Latex Support in Jekyll"
date: 2018-03-27
# category: guide
tags: [guide, latex]
---

In this post, I will illustrate how to enable Latex support in Markdown for your Jekyll blog without the use of external Jekyll plugins. 
This will allow you to benefit from beautiful typesetting even when using Github Pages, especially if you're mathematically inclined like me and wish to better disperse your writings in a clearer fashion. 
I only assume you're familiar with Jekyll and are proficient working with it, in order to save time reading about the nitty gritties of Jekyll.

You might be familiar with `MathJax` as the popular tool for rendering Latex in Markdown. However, MathJax can be a pain to set up and isn't definitely the fastest renderer out there. This is where `Katex` comes in.
Katex is a Latex parser written in Javascript that converts tags to Latex typeset font. It is maintained by the good old people over at Khan Academy (hence the name KATex) and is based upon the original Tex typesetting system created by the legendary Donald Knuth. 

The benefits of Katex over MathJax are multiple:
- Much, much faster rendering.
- Katex setup is ridiculously simple.
- Can work with editors such as VS Code with the right plugins (I'll elaborate on this in a later post).

Setting up Katex is incredibly easy. First of all, like any good JS library, you need to add the CSS and JS files to your site. If you're smart and have separate `head` and `footer` includes in your Jekyll blog, you can add this to your website `head`:

```html
<!-- Load KaTeX -->
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min.js"></script>
```

That little snippet loads the Katex CSS and JS for you from a CDN. That's pretty much all you need in terms of setting up Katex.

The next thing to figure out is how to render the latex correctly. Fortunately, the `kramdown` parser that comes with Jekyll comes with `Mathjax` built-in and thus parses the page by substituting `$$...$$` latex blocks with `script[type='math/tex']` or `script[type='math/tex'; mode=display]` blocks intelligently depending on whether you used the latex block as an inline equation or as an equation block. To use the equation block, all you need to do is put the latex on a new line surrounded by `$$`s with empty lines above and below it. To enable the `kramdown` parser to parse the document correctly, you need to set the markdown parser in the `_config.yml` file to the following:

```yml
markdown: kramdown
kramdown:
   math_engine: mathjax
```

However, we want to use Katex and not Mathjax, so we need a way to tell Katex what blocks we wish to parse. This is also easy to configure with a little Javascript smartness. To perform the rendering by reading the substituted `script` blocks, we need to add the following snippet at the end of our HTML page a.k.a. the footer:

```html
<!-- Parse the Latex divs with Katex-->
<script type="text/javascript">
  $("script[type='math/tex']").replaceWith(
    function(){
      var tex = $(this).text();
      return katex.renderToString(tex, {displayMode: false});
  });
  
  $("script[type='math/tex; mode=display']").replaceWith(
    function(){
      var tex = $(this).text();
      return katex.renderToString(tex.replace(/%.*/g, ''), {displayMode: true});
  });
</script>
``` 

What the above snippet basically says, is that when you encounter a `<script[type='math/tex]>` tag in the document, replace it with the Katex rendered string. To control whether it is inline or in a block, we set the `displayMode` option in the `renderToString` function accordingly, with `displayMode: false` being inline and `displayMode: true` being a block.

At this point, you are done with the setup and can start using Latex in your blog posts. For e.g.:

```html
Here, have some $$\pi$$.

The greatest equation known to man is: 

$$e^{ix} = \cos{x} + i\sin{x}$$
```

will render as:

> Here, have some $$\pi$$.

> The greatest equation known to man is: 

> $$e^{ix} = \cos{x} + i\sin{x}$$

At this point, you're all set and ready to roll with all the beauty of Latex typeset equations in your blog!
