# ransomAware.js
Be notified the moment you get ransomware by monitoring the filesystem

# Motivation
I was inspired by a group of University of Florida researchers who found a way to [stop ransomeware dead in its tracks](http://news.ufl.edu/articles/2016/07/extortion-extinction-researchers-develop-a-way-to-stop-ransomware.php) by detecting rather than preventing infection. Quote:

> “Our system is more of an early-warning system. It doesn’t prevent the ransomware from starting ... it prevents the ransomware from completing its task … so you lose only a couple of pictures or a couple of documents rather than everything that’s on your hard drive, and it relieves you of the burden of having to pay the ransom,” said Nolen Scaife, a UF doctoral student and founding member of UF’s Florida Institute for Cybersecurity Research.

According to the article, they "have a functioning prototype" but are "seeking a partner to commercialize it and make it available publicly." I'm going to reach out to the original research group over Twitter to get more details and make sure this tool is free. Because if not, well, that's understandable. The FBI estimates that ransomware creators made $24 million in successful ransoms last year. If UF sells the cure, part of that money could be going to UF. Regardless, I've already started working on something (without even reading the journal paper) based on my own knowledge of ransomeware, and it's gonna be free.

# Concepts
Most ransomware changes the filename and adds .crypt or .enc or something stupid. In hindsight, that's incredibly dumb. Because in a half hour, I can code up a software that tracks all file system modifications and alerts the user if files ending with known crypto-locker file extensions are created. The problem with that is they can simply change the file extension to something new, which is what they do.

So I do that, but I do one step more. ANY file extension that is 'new' and hasn't appeared in a folder before triggers an alert. So you get a lot of notifications up front, but after a learning period it learns what file types are "normal" to expect, and you'll only get alerts when something "unusual" happens.

This project is a work in progress, but already is capable of detecting the kinds of ransomware that 3 of my friends have been plagued by. Currently only installable via github or npm, but hopefully I'll come up with a simpler distribution mechanism.

# Installation
```
npm i -g ransomaware
```

# Usage
```
ransomaware
```
Alerts via node-notifier
