{
    "template": "../inc/arbitrary-page.template.source",
    "prefixtitle": false,
    "title": "Peter's Birthday Conference Call",
    "metadescription": "Life is hard, but we have the internet"
}
---

Bars are closed and nobody is allowed with 2 meters of anybody else and you
might actually be legally obliged to stay at home under threat of law. Still, it
is my birthday soon, and we have the internet. Let's have a shared, on-line,
quarantine toast to making it another year on this dying planet. Maybe our
last??

&nbsp;
<img src="dino.gif" width=62 height=78 alt="We gon' die" />
&nbsp; &nbsp; &nbsp; &nbsp;
<img src="dino.gif" width=62 height=78 alt="We gon' die" />
&nbsp; &nbsp; &nbsp; &nbsp;
<img src="dino.gif" width=62 height=78 alt="We gon' die" />
&nbsp; &nbsp; &nbsp; &nbsp;
<img src="dino.gif" width=62 height=78 alt="We gon' die" />
&nbsp; &nbsp; &nbsp; &nbsp;
<img src="dino.gif" width=62 height=78 alt="We gon' die" />
&nbsp; &nbsp; &nbsp; &nbsp;
<img src="dino.gif" width=62 height=78 alt="We gon' die" />
&nbsp; &nbsp; &nbsp; &nbsp;
<img src="dino.gif" width=62 height=78 alt="We gon' die" />

We're going to pour ourselves a drink, sit down in front of our computers, turn
on our webcams, and have a toast to... something. We can laugh at the absurdity
of the situation and then hang up, before it gets awkward. Or stay on the line,
until it gets awkward. Whatever you want.

There are a lot of you so it's difficult to coördinate a time that's really good
for everyone but here's my best effort.

| City          | Time Zone     | Date                   | Time   |
|:--------------|:--------------|:-----------------------|:-------|
| San Francisco | PDT (UTC-7)   | Friday 20 March 2020   | 15:00h |
| New York      | EDT (UTC-4)   | Friday 20 March 2020   | 18:00h |
| Berlin        | CET (UTC+1)   | Friday 20 March 2020   | 23:00h |
| Sydney        | AEDT (UTC+11) | Saturday 21 March 2020 | 09:00h |

_**Countdown: <span id="countdown">&nbsp;</span>**_

When that timer right there hits zero, refresh this page, and you'll get a link
to a Zoom conference call you can join. It should prompt you to install
everything you need, it's pretty seamless.

Thank you for indulging me on this stupid thing, I love you.

_—Peter_

<script>
var t = new Date("Mar 20, 2020 22:00:00 UTC").getTime();
var x = setInterval(function() {
  var now     = new Date().getTime();
  var delta   = t - now;
  if (delta > 0) {
    var days    = Math.floor( delta / (1000 * 60 * 60 * 24));
    var hours   = Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((delta % (1000 * 60)) / 1000);
    document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
  } else {
    document.getElementById("countdown").innerHTML = "zero, it's happening now!";
    clearInterval(x);
  }
}, 1000);
</script>