# Receptive Field of Convolutional Neural Network

## Receptive field of a single filter

To understand receptive fields of any arbitrary layer, we need to first understand the receptive field of a single layer or filter. Each filter consists of 3 parts, the receptive field $\Delta$ which is the field of view of a particular unit, the stride $\alpha$ which is the amount the filter jumps at each step, and the offset $\beta$ which is the starting position in the input around which the filter is centered and starts computing the output.

Given the above definitions and the location of the output $y_{i,j}$, we can compute the input locations affecting the filter as the interval below:

$$ x = \alpha*y_{i,j} + \beta + [-\frac{\Delta-1}{2}, \frac{\Delta-1}{2}] $$

This equation is common to all types of filters, but the specific values of $\Delta$, $\alpha$ and $\beta$ vary by filter type.

Let's take a look at 3 of the most common filters for which receptive field computations differ.

## Convoulutional Layer

Here the filter is of size $k$, with stride $s$ and the padding on the input is $P$, then we have the following definitions for the filter:

$$ \alpha = s $$

The filter's receptive field is the same as the filter size, i.e. 

$$ \Delta = k $$

The offset of the filter center on the input is given by 

$$\beta = \frac{k-1}{2} - P $$

We assume only a single dimension but these equations generalize to multidimensional cases and can be quite easily derived given the information here.

## Pooling Layer

Maxpooling (and its variants such as Sumpooling and Averagepooling) are common operations for subsampling the input as a form of dimensionality reduction.

## Convolutional Transpose



## Composing receptive fields

Now that we know the receptive field properties of a single filter, we can see the effect of composing multiple filters. Suppose $f$ and $g$ are 2 filters, then we can compose the filters like $h = f\circ g$. Now for each individual filter, we get the input values that affect the output value as:

$$ x_f = \alpha_f*y_g + \beta_f \pm (\frac{\Delta_f - 1}{2}) $$
$$ x_g = \alpha_g*y_h + \beta_g \pm (\frac{\Delta_g -1 }{2})$$

Therefore, replacing $y_g$ with $x_g$, we get:

$$ x_f = \alpha_f*(\alpha_g*y_h + \beta_g \pm (\frac{\Delta_g -1}{2})) + \beta_f \pm (\frac{\Delta_f-1}{2}) $$
$$ \implies x_f = \alpha_f*\alpha_g*y_h + \alpha_f*\beta_g \pm \alpha_f*(\frac{\Delta_g -1}{2}) + \beta_f \pm (\frac{\Delta_f-1}{2}) $$

We then regroup variables to get:

$$ x_f = \alpha_f*\alpha_g*y_h + \alpha_f\beta_g + \beta_f \pm [\frac{\alpha_f*(\Delta_g-1) + \Delta_f - 1}{2}]$$

Looking at the symmetry of the above equation with the equation of the single filter, we get the following definitions:

- Receptive field

$$ rf = \alpha_f(\Delta_g - 1) + \Delta_f $$

- Offset

$$ \beta = \beta_f + \alpha_f*\beta_g$$
$$ \implies \beta = \beta_f + \alpha_f*(\frac{k_g-1}{2} - P_g)$$

- Stride

$$ s = \alpha_f * \alpha_g $$


