template: blog/entry.template
title: Eliminate Twitter nonsense
---
Unfortunately, I occasionally visit Twitter. It's unfortunate because fully
half of their website (the right half) is now devoted to bullshit nonsense I
have no interest in seeing. Luckily, modern browsers let you override bad
website design! In Google Chrome on Mac OS, you can open your Custom.css
(typically in your user folder, under Library, Application Support, Google,
Chrome, Default, User StyleSheets) and paste in the following:

```
// Twitter right-hand side bullshit
#page-outer #page-container .dashboard { display:none; }
#page-outer #page-container .dashboard .component { display:none; }
#doc #top-stuff { display:none; }
```

Problem solved!
