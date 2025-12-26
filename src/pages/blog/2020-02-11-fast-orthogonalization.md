---
layout: ../../layouts/MarkdownPostLayout.astro
title: "A Simple Algorithm for Fast Orthogonalization"
date: 2020-02-11
tags: [math]
---

## Background

Orthogonal matrices $Q$ are some of the most useful special matrices in linear algebra.
Defined as a matrix such that each column is orthogonal to the others (where orthogonality means $x \cdot y = 0$), what makes them special is that their inverse is simply their transpose.
Thus:

$$
    Q^{-1} = Q^T
$$

This property has been exploited in multiple fields such as linear algebra, optimization, machine learning, and robotics. Oh and not to forget that all orthogonal matrices are basically rotations in a geometric sense. What that means is that when you multiply an orthogonal matrix with a vector $v$, it doesn't change the magnitude $\Vert v \Vert$ of the vector. Thus, multiplying a least-squares problem $\Vert Ax - b \Vert_2$ with $Q$ won't actually affect the solution, while allowing us to modify the problem to make it easier to solve.

As an extra benefit, you can also use orthogonal matrices in neat ways to figure out rotations of a robot in 3D space. Check out [Frank's new paper](https://dellaert.github.io/ShonanAveraging/) for a cool new algorithm to do that.

## Problem

While using orthogonal matrices make a lot of sense and allow tremendous benefits, we have to make sure that they do actually satisfy the orthogonality requirement. This becomes especially important when you multiply a large sequence of rotations and numerical errors creep into the solution, causing the requirement to not be satisfied, which makes the final result an invalid rotation. Similarly, you may want to enforce the requirement between iterations of gradient descent or whatever optimizer you are using.

So the question posed is, given a matrix which we know should be theoretically orthogonal, how can be orthogonalize (or normalize) the matrix so that it is a valid orthogonal matrix for computational and practical purposes?

To come up with an algorithm, we need to first set up some criteria for the result:

- The solution must be correct (important because then what's the point?).
- We should be able to find the solution using readily available tools and functions (you don't want to waste time debugging).
- The solution must be cheap to compute.

If you only care about the first 2 requirements, there already exists an elegant algorithm that solves the problem which is available in every mathematical toolkit, the Singular Value Decomposition or `SVD`.
Recall that the SVD decomposes a matrix $X$ into 3 matrices $USV^T$, of which $U$ and $V^T$ are orthogonal. So to enforce $X$ to be orthogonal, we try to find the closest orthogonal matrix $Q$ to $X$ (in the Frobenius norm). This matrix is simply $Q = UV^T$, and we're done with basically 2 lines of code.

The problem arises when we try to enforce the 3rd criteria. The cost of the `SVD` is $O(mn^2)$ for a $m \times n$ matrix, which doesn't seem too bad for $3 \times 3$ rotation matrix, but if you checked out Frank's paper, you know that we are not always restricted to the `SO(3)` group. This also becomes particularly expensive when we decide to perform lots of rotations and need to constantly orthogonalize after every few matrix multiplications.

A new algorithm I recently discovered that checks all the boxes is provided by [Premerlani and Bizard](https://drive.google.com/file/d/0B9rLLz1XQKmaZTlQdV81QjNoZTA/view) in their paper for rotation matrices for IMUs. They call their algorithm `Renormalization` and it is quite intuitive to understand.

Say we have a matrix $M$ which we need to (re-)normalize. For the sake of simplicity, we will only focus on $3 \times 3$ rotation matrices. Thus, $M$ has 3 columns, which we will denote as the vectors $x$, $y$, and $z$. The first step is to understand how much $x$ and $y$ are drifting towards each other. This drift error can be computed using the dot product of the two vectors

$$
    e = x \cdot y
$$

The assumption made here is that the error is contributed to equally by both $x$ and $y$, so we should apportion half of the error to each vector, and rotate them in the other direction, the argument being made is that it leads to lower residual error than if we assigned the error to a single vector (which makes sense, you got to share the blame).

$$
    x_{orth} = x - \frac{e}{2}y
$$

$$
    y_{orth} = y - \frac{e}{2}x
$$

Finally, to compute $z$, we can simply use the cross-product to find a vector orthogonal to both $x_{orth}$ and $y_{orth}$.

$$
    z_{orth} = x_{orth} \times y_{orth}
$$

There is one final thing we need to worry about though: each column of the orthogonal matrix should have magnitude 1. This is another part of the definition of an orthogonal matrix.
Now you could simply say, "oh well, we could just compute the magnitudes via the sum of squares and normalize" and yes you can, but there is an easier way which doesn't involve expensive division operations.

The key identified in the paper is that the magnitude of the vectors resulting from the drift correction will never be too far away from 1, which means that a simple Taylor series expansion (in their words) can be performed to get the result without division:

$$
    x_{normalized} = \frac{1}{2}(3 - x_{orth} \cdot x_{orth}) x_{orth}
$$

$$
    y_{normalized} = \frac{1}{2}(3 - y_{orth} \cdot y_{orth}) y_{orth}
$$

$$
    z_{normalized} = \frac{1}{2}(3 - z_{orth} \cdot z_{orth}) z_{orth}
$$

taking about 48 floating point operations in total.

Thus, the complete algorithm can be written with `numpy` as

```python
def normalize(M):
    x, y, z = M
    e = np.dot(x, y)
    x_orth = x - (0.5*e*y)
    y_orth = y - (0.5*e*x)

    z_orth = np.cross(x_orth, y_orth

    R = np.vstack((x_orth, y_orth, z_orth))

    # neat trick to get np.dot(v, v) for all columns
    c = np.diag(R.T @ R)
    c = 0.5*(3 - c)
    # add another dimension, so that we have column-wise scaling
    # an equivalent (though less intuitive) function is `Q = (M.T * c).T`
    Q = M * c[:, np.newaxis]
    return Q
```

Hope you can find use for this neat new algorithm in your own work.
