![Australian Government - Department of Porting Things to TypeScript](https://aus-crest.vercel.app/stacked.png?agency=Department%20of%20Porting%20Things%20to%20TypeScript&height=600)

# Australian Government Crest Branding API - in TypeScript!

## Port information

This is a TypeScript/Express port of the Australian Government's branding API to generate logos with text (originally written in Kotlin and Spring Boot). The logos it generates are almost identical to the original ones (just some small font rendering differences), and from some unscientific tests it appears to be substantially faster. The actual API/query parameter usage is backwards compatible with the original implementation, but there are additional features.

## API docs

This api generates Government logos using the coat of arms that follow [the guidelines](https://beta.dta.gov.au/help-and-advice/guides-and-tools/requirements-australian-government-websites/branding)

Although this api is live, it's not monitored or setup to horizontally scale.

Use it in production at your risk.

You're better off using it to generate images and then serve them yourself

## Examples

### Inline
```
https://aus-crest.vercel.app/inline.png?agency=Department%20Of%20Finance&height=200
```

![Inline](https://aus-crest.vercel.app/inline.png?agency=Department%20Of%20Finance&height=200)



### Stacked
```
https://aus-crest.vercel.app/stacked.png?agency=Department%20Of%20Finance&height=200
```

![Inline](https://aus-crest.vercel.app/stacked.png?agency=Department%20Of%20Finance&height=200)



### Inline with multiple agencies
```
https://aus-crest.vercel.app/inline.png?agency=Department%20Of%20Health&agency=Department%20of%20Foreign%20Affairs%20and%20Trade&agency=Attorney-General%27s%20Department&height=200
```

![Inline with multiple agencies](https://aus-crest.vercel.app/inline.png?agency=Department%20Of%20Health&agency=Department%20of%20Foreign%20Affairs%20and%20Trade&agency=Attorney-General%27s%20Department&height=200)

### Stacked with multiple agencies
```
https://aus-crest.vercel.app/stacked.png?agency=Department%20Of%20Health&agency=Department%20of%20Foreign%20Affairs%20and%20Trade&agency=Attorney-General%27s%20Department&height=200
```

![Inline with multiple agencies](https://aus-crest.vercel.app/stacked.png?agency=Department%20Of%20Health&agency=Department%20of%20Foreign%20Affairs%20and%20Trade&agency=Attorney-General%27s%20Department&height=200)



### Inline and tertiary (also with forced new line)
```
https://aus-crest.vercel.app/inline.png?agency=Department%20of%20the%0APrime%20Minister%20and%20Cabinet&agency=%7CGovernment%20Branding%20Unit&height=200
```

![Inline and tertiary ](https://aus-crest.vercel.app/inline.png?agency=Department%20of%20the%0APrime%20Minister%20and%20Cabinet&agency=%7CGovernment%20Branding%20Unit&height=200)


## Basic usage

There are two endpoints:

### Inline usage
https://aus-crest.vercel.app/inline.png


### Stacked usage
https://aus-crest.vercel.app/stacked.png


## Params
Both endpoints take the same parameters:

### 'agency'
The name of the agecny to display.

You can add as many '&agency' paramaters as you like, they will be added in order.

The guidelines cater for sub-headings, for things such as function names.

These use a non-bold font.

If you prepend an 'agency' param with a pipe char (|, or %7C), that text will be a sub-heading

Lines won't wrap.

If you want to break up a line, add a newline (\n, or %0A).

### 'height'
Sets the total height of the image.

The width is derrived based on the longest 'agency' parameter

### 'square'
Overrides the natural aspect-ratio of the images and pads it out to be a square

### 'custom_govt'
Overrides the "Australian Government" text with the parameter value