---
layout: post
title:  "Geometry of Convolutional Neural Networks"
date:   2018-05-07
# category: guide
tags: [deep learning, guide]
---

The quest to understand deep learning is still an ongoing endeavour and one of the important aspects of Convolutional Neural Networks that is well understood is the geometry of the CNN. By geometry, we mean the effect of parts of the input on the feature map output at every layer. This involves the receptive field of the network amongst other things. This is an important concept to grasp since it can better help us understand what each layer and each channel is truly learning, unveiling more of that deep learning black box to us.

However, despite being an important topic to understand, there is very little literature that covers this from a unified approach and that mathematically derives and explains the meaning behind different aspects of a CNN's geometry. From my own research, the main documents that I have encountered are the [VLFeat manual][1], a [ white paper from the University of Central Floria][2] and a [blog post][3] that gives the math with some nice visualizations. However, each of these sources either do not provide a full mathematical understanding of the receptive fields or are implementation specific, with VLFeat having the unfortunate side-effect of assuming 1-indexing due to Matlab.

In this post, I provide a mathematically sound and intuitive understanding of CNN receptive fields in a unified way so that one can use the math here to derive the receptive fields in their own work. The only assumptions I make are that everything is 0-indexed, you are familiar with how a CNN works, and you have had at least high school level training in mathematical notation (no fancy linear algebra or calculus needed).

## Receptive field of a single filter

To understand the receptive field of any arbitrary network, we need to first understand the receptive field of a single layer or filter. Each filter consists of 3 parts, 

- The receptive field <latex>\Delta</latex> which is the field of view of a particular unit.
- The stride <latex>\alpha</latex> which is the amount the filter jumps at each step.
- The offset <latex>\beta</latex> which is the starting position in the input around which the filter is centered and starts computing the output.

Given the above definitions and the location of the output <latex>y_{i,j}</latex>, we can compute the input locations affecting the output via the filter as the interval below:

<latex-block> x_{i,j} = \alpha*y_{i,j} + \beta + [-\frac{\Delta-1}{2}, \frac{\Delta-1}{2}] </latex-block>

This equation may seem arbitrary and hard to reason about, but if you draw out a simple convolution using a 3x3 filter on a, say, 10x10 image with padding 1, you will see that this equation holds true. More importantly, this equation is common to all types of filters, but the specific values of <latex>\Delta</latex>, <latex>\alpha</latex> and <latex>\beta</latex> vary by filter type.

Let's take a look at 3 of the most common filters for which receptive field computations differ.

## Convolutional Layer

As we know, a Convolutional layer just applies a convolution operation on an image using a fixed size filter. Here the filter is of size <latex>k</latex>, with stride <latex>s</latex> and the padding on the input is <latex>P</latex>, then we have the following definitions for the filter:

<latex-block> \alpha = s </latex-block>

The filter's receptive field is the same as the filter size, i.e. 

<latex-block> \Delta = k </latex-block>

>It is important to note that <latex>k</latex> is the effective kernel dimension. Thus, with dilation <latex>d</latex>, <latex>k</latex> would actually be "<latex>d*(k-1) + 1</latex>" but we assume <latex>d=1</latex> for simplicity. 

The offset of the filter center on the input is given by 

<latex-block>\beta = \frac{k-1}{2} - P </latex-block>

We derive these values only along a single dimension, rather than 2 dimensions as is common in images, but these equations generalize to multidimensional cases and can be quite easily derived given the information here.

## Pooling Layer

Pooling layers (such as Max-pooling and Average-pooling) are common operations for subsampling the input as a form of dimensionality reduction. As such, they can be viewed as filters with a fixed window size, beginning offset and stride.

The receptive field of the pooling filter is the same as the window size, therefore 

<latex-block>\Delta = k</latex-block>

Similarly, the stride is the stride of the filter, 

<latex-block> \alpha = s </latex-block>

However, the offset can be a bit tricky to compute for the pooling layer since the output size of the layer is pre-computed based on the input dimension and the parameters of the filter such as stride and kernel size. Thus, any padding applied is "implicit" and not "explicit" like in Convolutional layers. By implicit, we mean that padding is assumed and only added to the bottom and right in the case of 2D feature maps rather than tacked onto the input. This would mean that for example, on a 10x10 input map with a 3x3 filter of stride 2, the filter would overrun the input at the bottom since only rows 9 and 10 would fit in the kernel window. What happens then is that the 11th row is assumed to be <latex>-\infty</latex> in the case of Max-pooling.

To compute the output height <latex>H</latex> and output width <latex>W</latex>, one can use the following formula:

<latex-block>
\begin{matrix}
W = \lfloor(w - k_w + 2*P_w) / s_w\rfloor + 1 \\
H = \lfloor(h - k_h + 2*P_h) / s_h\rfloor + 1 
\end{matrix}
</latex-block>

Here <latex>P_w</latex> and <latex>P_h</latex> are the padding values you specify, but this need not be the actual padding applied.

From the above equation, we can compute the needed padding using some cleverness in the floor function as

<latex-block> 
\begin{matrix}
P_w^\prime = \lfloor{(W*s_w - w + k_w) / 2}\rfloor \\
P_h^\prime = \lfloor{(H*s_h - h + k_h) / 2}\rfloor
\end{matrix}
</latex-block>

If you don't find yourself convinced by the above formula, you can try it out with some simple examples such as <latex>h=11</latex>, <latex>k_h=3</latex>, <latex>s_h=2</latex> and <latex>P_h=1</latex>. You will find that <latex>H=6</latex> and so the actual padding at the bottom needed would be <latex>P_w^\prime=2</latex>, an important distinction since we specified the padding to be 1. I would advise you draw this out in 1 dimension and verify it for yourself.

## Convolutional Transpose

The Convolutional Transpose layer (also known as deconvolution layer or fractionally-strided convolution) is the trickiest layer to understand conceptually due to the nature of its operation. The key idea to remember is that the Convolutional Transpose is just the transpose of a convolution operation and that if we look at the data dependency of this layer from output to input (i.e. backwards), it is the same as a convolutional layer. We can use this idea to derive the equations for the receptive field of this layer.

The original receptive field dependency equation of the convolutional layer can be rewritten as:

<latex-block> -\frac{\Delta-1}{2} \leq x - \alpha*y -\beta \leq \frac{\Delta-1}{2} </latex-block>

Now we do some simple manipulation to reverse <latex>x</latex> and <latex>y</latex>:

<latex-block> -\frac{\Delta-1 + \alpha-\alpha}{2} \leq x - \alpha*y -\beta \leq \frac{\Delta-1+\alpha-\alpha}{2} </latex-block>

Divide by <latex>alpha</latex>

<latex-block> -\frac{\Delta-1 + \alpha-\alpha}{2\alpha} \leq \frac{x - \alpha*y -\beta}{\alpha} \leq \frac{\Delta-1+\alpha-\alpha}{2\alpha} </latex-block>

<latex-block> \implies -\frac{\frac{\Delta-1+\alpha}{\alpha} - 1}{2} \leq \frac{x}{\alpha} - y - \frac{\beta}{\alpha} \leq \frac{\frac{\Delta-1+\alpha}{\alpha} - 1}{2} </latex-block>

<latex-block> \implies -\frac{\frac{\Delta-1+\alpha}{\alpha} - 1}{2} \leq -y + \frac{x}{\alpha} - \frac{\beta}{\alpha} \leq \frac{\frac{\Delta-1+\alpha}{\alpha} - 1}{2} </latex-block>

Multiple everything by -1 since we want to bring this inequality to an equivalent form of the original dependency equation,

<latex-block> -\frac{\frac{\Delta-1+\alpha}{\alpha} - 1}{2} \leq y - \frac{x}{\alpha} - \frac{-\beta}{\alpha} \leq \frac{\frac{\Delta-1+\alpha}{\alpha} - 1}{2} </latex-block>

Thus, we get the following definitions for the convolutional transpose operation:

<latex-block> \hat{\Delta} = \frac{\Delta+\alpha-1}{\alpha}</latex-block>

<latex-block> \hat{\alpha} = \frac{1}{\alpha} </latex-block>

<latex-block> \hat{\beta} = \frac{-\beta}{\alpha} </latex-block>

We can now input the values of the convolutional layer to get the exact values for the convolutional transpose layer:

<latex-block> \hat{\Delta} = \frac{k+s-1}{s} </latex-block>
<latex-block> \hat{\alpha} = \frac{1}{s} </latex-block>
<latex-block> \hat{\beta} = -\frac{\frac{k-1}{2} - P}{s} = -\frac{k-1-2P}{2s} = \frac{2P-k+1}{2s} </latex-block>


## Composing receptive fields

Now that we know the receptive field properties of a single filter, we can see the effect of composing multiple filters. Suppose <latex>f</latex> and <latex>g</latex> are 2 filters, then we can compose the filters like <latex>h = f\circ g</latex>. Now for each individual filter, we get the input values that affect the output value as:

<latex-block> x_f = \alpha_f*y_g + \beta_f \pm (\frac{\Delta_f - 1}{2}) </latex-block>
<latex-block> x_g = \alpha_g*y_h + \beta_g \pm (\frac{\Delta_g -1 }{2})</latex-block>

Therefore, replacing <latex>y_g</latex> with <latex>x_g</latex>, we get:

<latex-block> x_f = \alpha_f*(\alpha_g*y_h + \beta_g \pm (\frac{\Delta_g -1}{2})) + \beta_f \pm (\frac{\Delta_f-1}{2}) </latex-block>
<latex-block> \implies x_f = \alpha_f*\alpha_g*y_h + \alpha_f*\beta_g \pm \alpha_f*(\frac{\Delta_g -1}{2}) + \beta_f \pm (\frac{\Delta_f-1}{2}) </latex-block>

We can then regroup variables to get:

<latex-block> x_f = \alpha_f*\alpha_g*y_h + \alpha_f\beta_g + \beta_f \pm [\frac{\alpha_f*(\Delta_g-1) + \Delta_f - 1}{2}]</latex-block>

Looking at the symmetry of the above equation with the equation of the single filter, we get the following definitions:

- Receptive field

<latex-block> rf = \alpha_f(\Delta_g - 1) + \Delta_f </latex-block>

- Offset

<latex-block> \beta = \beta_f + \alpha_f*\beta_g</latex-block>

- Stride

<latex-block> s = \alpha_f * \alpha_g </latex-block>

The actual values would of course depend on the type of filter in question since as we have seen, each unique type of filter as slightly different geometric properties. However, these equations work across them so computing the receptive fields via code can be easily accomplished with some convenient checks and function chaining.

To better help with understanding the receptive field computations, I have included a quick python script below which you can play around with.

```python
def get_receptive_field(layer):
    """Compute receptive field on a per layer basis"""
    k, s, p = layer[1:]
    offset = (k-1)/2 - p
    rf = k
    return rf, offset, s

def model_receptive_field(model):
    """
        Get the receptive field of the model. Also print receptive field on a per layer basis.
        model: dict mapping layer to next layer with params.
        `params` is of format (layer_name, layer_type, kernel_size, stride, padding)
    """
    rf, offset, s = 1, 0, 1

    layer = "input"

    while True:    
        layer = model[layer]
        if layer is None:
            break
        
        if layer[1] in ["batchnorm", "relu"]: 
            layer = layer[0]
            print(layer, rf, s, offset)
            continue

        delta, beta, alpha = get_receptive_field(layer)

        rf = s*(delta-1) + rf
        offset = offset + s*beta
        s = s*alpha

        layer = layer[0]
        print(layer, rf, s, offset)

    return rf, s, offset

# model is a dict of layer output to next layer with the next layer's params.
# These are the initial few layers of the ResNet-152 model.
model = {
    "input": ('conv1', 'conv', 7, 2, 3), 
    "conv1": ('bn1', 'batchnorm', ),
    "bn1": ('relu', 'relu', ),
    "relu": ('pool1', 'pooling', 3, 2, 0),  # Padding is set to 1, but the computations effectively make the top padding 0
    "pool1": None
}

rf, stride, offset = model_receptive_field(model)
print(rf, stride, offset)
```

Hopefully, at this point you should feel that you have a much better understanding of the geometry of receptive fields and you feel capable of applying this information to whatever new CNN based project you're working on.

[1]: http://www.vlfeat.org/matconvnet/matconvnet-manual.pdf
[2]: https://arxiv.org/abs/1705.07049
[3]: https://medium.com/mlreview/a-guide-to-receptive-field-arithmetic-for-convolutional-neural-networks-e0f514068807