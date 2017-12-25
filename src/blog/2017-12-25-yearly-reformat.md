{ "title": "My yearly reformat" }
---

Every few hours I make sure to clear out all my tabs from my browser.
And once a year or so, I like to reformat my Mac, and start it back from scratch.
This year, I thought I'd try to do it a little bit more privacy-focused.

<!-- Anyone in infosec will tell you this is a fruitless execise unless you first
 [define your threat model](https://en.wikipedia.org/wiki/Threat_model).
So, let me do that upfront.
I'm interested in practicing reasonable opsec,
 and am willing to go a bit out of my way to do it,
 but I'm not willing to completely change the way I do computers.
Basically, I want to make sure I've done everything reasonably possible to protect against typical attack and fraud vectors.
And I want to make it as difficult as possible to track my online behavior.

So, for example: I use a [1Password](https://1password.com/) (for security), but with cloud syncing enabled (for convenience).
Or: I use Dropbox (for convenience), but I encrypt my strongest secrets with Keybase (for security).
So I'm not gonna install [Qubes](https://www.qubes-os.org/); I _like_ macOS.
But I do keep separate browsers for the common social networks,
 and killfile all the common domains in my main browser, to avoid tracking to some degree.
And while I have several VPNs, I always opt-in to connecting to them.

I'm gonna try a few extra precautions this time around.
I won't sign in to an iCloud account, and I'll explicitly opt-out of all analytics sharing.
I'll switch my default search engine to [DuckDuckGo](https://duckduckgo.com).
Small things that, in aggregate, should improve my general opsec without killing my convenience. -->

Since I've done reformats a few times, I'm pretty good at them by now.
This time I took some notes. Here's my process!

First, I source a USB stick, at least 8GB, to hold the macOS installer.
The specific details change, so I basically search "install mac on usb stick" and take the first result as a guide.
[Here's what I found](https://support.apple.com/en-us/HT201372) this time.

Step two, I make a backup archive of the critical stuff.
This usually means SSH keys, and my 1Password recovery guide. 
The former I can copy from $HOME/.ssh, and the latter can be created from within 1Password.
I tar and gzip and encrypt all those things together, and then copy that file to two safe places.
If you have another USB stick, that works great.
Otherwise, since it's encrypted, you can put it somewhere public, like a webserver.
It's temporary, anyway.

Step three, I do a `brew list` and `brew cask list` and save the output.
I won't use this directly, it's just a reference.
There tend to be some programs and utilities that I forget about: for example,
 reattach-to-user-namespace is usually necessary to get tmux to play nicely with iTerm2.

Step four, I double check I've not forgotten anything important,
 I make sure I've committed and pushed all my git repos, 
 and then start the format.
Restart and, once the screen goes black, hold down Command+R.
As soon as the Apple appears, release it.
When the utilities app comes up, select Disk Utility, and erase the built-in disk.
When reformatting, be sure to choose the encrypted disk option.

Step five, make sure the USB stick is inserted, and reboot again.
When the screen goes black, hold down Option.
Then, select the USB stick to boot from it.
Thus begins the typical macOS install. It tends to take about half an hour of waiting.
Then you have a fresh system.

Under System Preferences, there are a few changes I always make.

- Sharing: Computer name: set this to whatever
- Dock: Left, size small-ish, check Automatically hide and show
- Desktop and Screen Saver: Screen Saver: Hot Corners: bottom right: Put display to sleep
- Spotlight: uncheck everything except Applications, Folders, and System Preferences
- Trackpad: enable tap-to-click
- Keyboard: Keyboard: set Key Repeat to Fast, and Delay Until Repeat to Short
- Keyboard: Keyboard: uncheck Adjust keyboard brightness in low light
- Keyboard: Shortcuts: Full keyboard access: All controls
- Keyboard: Shortcuts: Accessibility: check Invert Colors
- Accessibility: Zoom: check Use Scroll Gesture

And a few changes to Finder.

- Preferences: New Finder window shows: home directory
- Preferences: Advanced: Show all filename extensions
- Preferences: Advanced: Keep folders on top when sorting by name
- View: Show Status Bar, Show Path Bar

Next, I got Homebrew going.
I use Safari to go to [brew.sh](https://brew.sh) and copy the install instructions.
Open Terminal, paste; the XCode command line tools get installed.
I turned off analytics, installed [Homebrew Cask](https://caskroom.github.io/), and installed the first set of applications.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew analytics off
brew tap caskroom/cask

brew install git fish tmux reattach-to-user-namespace
# set fish as my default shell, by the instructions
brew install --devel go
brew cask install google-chrome sizeup 1password keybase dropbox spotify iterm2 visual-studio-code
```

Next I grabbed the archive from where I stashed it, and decrypted it.
This involved a `keybase login`, which required me to remember my passphrase. Luckily, I've done that!
When that was done, I rotated all my keybase devices, and generated new paper keys.
I installed my SSH keys, logged in to 1Password, and destroyed the archive.
(I rotate the SSH keys at the end.)

All other passwords are gated by 1Password.
So, from this point, I'm able to log in to Dropbox and start syncing.

Now I can set up my terminal environment.
First, gotta configure iTerm a little bit:
 in Preferences, in General, I uncheck all the Closing options.
To allow me to option+delete to delete words, in Keys, I add a new Key Mapping for option+delete
 and have it Send Hex Code 0x17.

Then, I clone my dotfiles repos, and run the install scripts.
These are designed to be idempotent, so it works without too much fuss.
I open up Visual Studio Code and installed the only two extensions I use:
 the Monokai Dark Soda theme, and the Go plugin.

Then, I set up Chrome.
First, I make sure it's the default browser.
Next, I set up DuckDuckGo as the default search engine.
Next, I log in. I know this isn't great, but the convenience is just too high. I may re-evaluate this later.

Next, I set up my VPNs.
I don't want to give too much away, and the details differ based on the VPN provider, anyway.
So, just make sure you have access to that documentation.

By now, it's usually about two hours since I started, and the computer is pretty much back to the way it was.
At this point I create new SSH keys and rotate all the accounts I can remember.
Invariably I'll forget some accounts until the moment when I really need to use them,
 so I keep the old keys around as one-offs, until I'm confident I've got everything fixed.

That's it! Maybe this helps someone.