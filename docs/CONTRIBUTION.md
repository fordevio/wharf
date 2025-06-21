---
weight: 501
toc: true
title: Contributing
menu:
    docs:
        parent: community
lead: ""
images: []
draft: false
description: How can I contribute to the wharf?
---

This project is licensed under the [Apache 2.0 license](LICENSE) and accept
contributions via GitHub pull requests. This document outlines some of the
conventions on development workflow, commit message formatting, contact points
and other resources to make it easier to get your contribution accepted.

To maintain a safe and welcoming community, all participants must adhere to the
project's [Code of Conduct](../code-of-conduct.md).

# Certificate of Origin

By contributing to this project you agree to the Developer Certificate of
Origin (DCO). This document was created by the Linux Kernel community and is a
simple statement that you, as a contributor, have the legal right to make the
contribution. See the [DCO](DCO) file for details.

# Email and Chat

The project currently uses the [forDEV-io Slack](https://join.slack.com/t/fordev-io/shared_invite/zt-37ixcb48j-o9AnvibyCSc0PCRQdIZIHg):
- Join `#wharf` channel 

Please avoid emailing maintainers found in the MAINTAINERS file directly. They
are very busy and read the mailing lists.


# Office Hour Meetings

The project also holds bi-weekly public meetings where maintainers,
contributors and users of the Wharf can
discuss issues, pull requests or any topic related to the projects. The
meetings happen at 4:00 PM IST (Indian Standard Time) or 10:30 AM UTC on Sundays, check the [online
notes](https://docs.google.com/document/d/1Eb5ARim3rbuwpPDcWD12ZXOlN0Fu0CsApDAfe_UbFE8/edit?usp=sharing)
to know the exact dates and the connection details.

An invite is also available on the [project's public calendar](https://calendar.app.google/riYQ51L51dkkj8gA8).


## Getting Started

- Fork the repository on GitHub
- Read the [README](../README.md), [CONTRIBUTION](../docs/CONTRIBUTION.md), [TESTING](../docs/TESTING.md), [DEVELOPMENT](../docs/DEVELOPMENT.md)  for build and test instructions
- Play with the project, submit bugs, submit patches!

## Contribution Flow

This is a rough outline of what a contributor's workflow looks like:

- Create a topic branch from where you want to base your work (usually `main`).
- Make commits of logical units.
- Make sure your commit messages are in the proper format (see below).
- Push your changes to a topic branch in your fork of the repository.
- Make sure the tests pass, and add any new tests as appropriate. ([Testing guidelines](TESTING.md))
- Submit a pull request to the original repository.

Before submitting a pull request, make sure that you've executed `make format` and committed the format changes.

Thanks for your contributions!

## Directory structure
- **assets**: contains different assets used in documentation.
- **client**: contains reactjs code for user interface.
- **cmd** : contains entrypoint of the application.
- **conf** : contains configuration files for the application.
- **deployment** : contains deployments files to be used during deployment.
- **docs** : contains docs for the application.
- **internal**: contains internal go packages which contains api definitions.
- **pkg**: contains go packages to to be used by internal packages.
- **test**: contains integration tests.

### Format of the Commit Message

We follow a rough convention for commit messages that is designed to answer two
questions: what changed and why. The subject line should feature the what and
the body of the commit should describe the why.

```
scripts: add the test-cluster command

This uses tmux to setup a test cluster that you can easily kill and
start for debugging.

Fixes #38
```

The format can be described more formally as follows:

```
<subsystem>: <what changed>
<BLANK LINE>
<why this change was made>
<BLANK LINE>
<footer>
```

The first line is the subject and should be no longer than 70 characters, the
second line is always blank, and other lines should be wrapped at 80 characters.
This allows the message to be easier to read on GitHub as well as in various
Git tools.

# Local Development

See [DEVELOPMENT](./DEVELOPMENT.md)


# Proposal Process

The wharf project accepts proposals for new features,
enhancements and design documents. The document should be created in the
`Documentation/proposals` directory using the template below, prefixed by
`<YEAR><MONTH>-` and submitted in the form of a GitHub Pull Request.

The process is adopted from the Thanos community.

```markdown mdox-exec="cat Documentation/proposals/template.md"
## Your Proposal Title

* **Owners:**
  * `<@author: single champion for the moment of writing>`

* **Related Tickets:**
  * `<JIRA, GH Issues>`

* **Other docs:**
  * `<Links…>`

> TL;DR: Give a summary of what this document is proposing and what components it is touching.
>
> *For example: This design doc is proposing a consistent design template for “example.com” organization.*

## Why

Provide a motivation behind the change proposed by this design document, give context.

*For example: It’s important to clearly explain the reasons behind certain design decisions in order to have a
consensus between team members, as well as external stakeholders.
Such a design document can also be used as a reference and for knowledge-sharing purposes.
That’s why we are proposing a consistent style of the design document that will be used for future designs.*

### Pitfalls of the current solution

What specific problems are we hitting with the current solution? Why is it not enough?

*For example: We were missing a consistent design doc template, so each team/person was creating their own.
Because of inconsistencies, those documents were harder to understand, and it was easy to miss important sections.
This was causing certain engineering time to be wasted.*

## Goals

Goals and use cases for the solution as proposed in [How](#how):

* Allow easy collaboration and decision making on design ideas.
* Have a consistent design style that is readable and understandable.
* Have a design style that is concise and covers all the essential information.

### Audience

If this is not clear already, provide the target audience for this change.

## Non-Goals

* Move old designs to the new format.
* Not doing X,Y,Z.

## How

Explain the full overview of the proposed solution. Some guidelines:

* Make it concise and **simple**; put diagrams; be concrete, avoid using “really”, “amazing” and “great” (:
* How will you test and verify?
* How will you migrate users, without downtime. How do we solve incompatibilities?
* What open questions are left? (“Known unknowns”)

## Alternatives

This section should state potential alternatives.
Highlight the objections the reader should have towards your proposal as they read it.
Tell them why you still think you should take this path.

1. This is why not solution Z...

## Action Plan

The tasks to do in order to migrate to the new idea.

* [ ] Task one

  <gh issue="">

* [ ] Task two

  <gh issue="">

  ...
```