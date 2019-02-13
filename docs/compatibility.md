---
Title: Version compatibility
---

# Version compatibility

The table below shows the versions of Alfresco's backend services that
have been tested with latest versions of ADF.

Our goal is to support ADF for *all* versions of Content Services
and Process Services. However, we only test against a subset of those
versions that believe to be representative. If a bug is reported for a
version that we don't test against then the bug will still be fixed in
the next release (ie, the fact that a version is not tested doesn't mean that it isn't supported).

Note that [*smoke testing*](https://en.wikipedia.org/wiki/Smoke_testing_%28software%29) implies that the product will not "go up in smoke" when
used but the tests are quicker and not as thorough as with *full testing*.

You can find further information about released versions of ADF in the
[version index](versionIndex.md) and the [release notes](release-notes/README.md).

| ADF version | Content Services | Process Services |
| -- | -- | -- |
| [3.0.0](versionIndex.md#v300) | **Full test:** v6.1.0 RC7 <br/> **Smoke test:** v5.2.4 | **Full test:** v2.0.0 (latest CI pipeline build), v1.9.0 <br/>**Smoke test:** v1.8.1 |
| [2.6.0](versionIndex.md#v260) | **Full test:** v6.0.0, v5.2.4 <br/> **Smoke test:** v5.2.3 | **Full test:** v1.9.0 <br/>**Smoke test:** v1.8.1, v1.7.0, v1.6.4  |
| [2.5.0](versionIndex.md#v250) | **Full test:** v5.2.3 | **Full test:** v1.6.4 |
| [2.4.0](versionIndex.md#v240) | **Full test:** v5.2.3 <br/> **Smoke test:** v6.0.0 | **Full test:** v1.8.1 <br/> **Smoke test:** v1.9.0, v1.8.0, v1.7.0, v1.6.4 |
