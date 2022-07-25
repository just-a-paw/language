# Contributing

[miscellaneous localisation]: #miscellaneous-localisation
[crowdin]: https://crowdin.com/project/paw-bot

## Scope

This repository's purpose is

* Continuous Integration (CI);
* Continuous Delivery (CD);
* maintaining the source locale;
* providing and maintaining miscellaneous locale;
* providing these locales as a Node.js library

and not

* providing, maintaining or discussing locale provided by Discord, this is done via [Crowdin].

## Crowdin localisation

All 30 locales provided by Discord (exluding below) are localised on [Crowdin].  
If your locale isn't on Crowdin, see [miscellaneous localisation].  

The following are not localised on Crowdin, see [miscellaneous localisation]:

* Croatian;
* Hindi;
* Thai;
* Chinese, Taiwan.

## Miscellaneous localisation

Add your locale the manual way if it's not on [Crowdin].

### Prerequisites

[Node.js](https://nodejs.org/) version 12 or higher is needed to lint and test.  
[Git command-line tools](https://git-scm.com/downloads).

### Steps

[Fork this repository](/fork).  

`git clone` your fork  

`npm install`  

Copy the source locale folder `en-GB` to a folder with the name of your locale's correct [IEFT BCP 47 / RFC 5646](https://developer.crowdin.com/language-codes/) language tag and optional territory tag  

Localise the contents of your locale's folder (not `en-GB`!) from English to your locale using the editor of your choice.  

Once satisfied, run without issues:  

```sh-connection
npm run lint:fix
npm run test
```

Create your branch, commit your changes and push. Replace `ar` with your [IEFT BCP 47 / RFC 5646](https://developer.crowdin.com/language-codes/) code:  

```sh-connection
git switch -c feat/ar
git commit -m 'feat(ar): add translation'
git push -u origin HEAD
```

[Pull request](/compare).
