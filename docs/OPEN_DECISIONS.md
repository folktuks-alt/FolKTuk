# FolkTuk Open Decisions

This register distinguishes user-approved direction from recommendations and decisions still open. No software or services were installed, changed, or started during the assessments recorded here.

## Approved foundation direction

The user approved the following direction on 2026-10-27:

- Node.js 24 LTS.
- npm workspaces.
- Next.js, React, and TypeScript for the frontend.
- NestJS and TypeScript for the backend.
- PostgreSQL.
- Prisma ORM 7 with Prisma Migrate as the preferred database approach.

Native PostgreSQL availability on the existing PC was to be investigated before choosing a local database setup. These approvals do not authorize installations, scaffolding, Git initialization, or service startup. Exact package pins below are recommendations, not separately approved dependency decisions.

## Compatibility and environment assessment

Assessment date: 2026-10-27. Exact package metadata was read from the npm registry, official Node.js distribution metadata, and the framework documentation linked below. No packages were installed and no dependency tree was resolved or built, so compatibility is supported by published requirements and peer ranges, not proven by a project build.

### Native PostgreSQL findings

The following read-only checks did not detect a PostgreSQL installation:

- `psql.exe`, `postgres.exe`, and `pg_ctl.exe` were not found via the current PATH.
- No matching PostgreSQL entries appeared in the checked machine- and user-level uninstall registry locations or PostgreSQL installation registry keys.
- No PostgreSQL Windows service was found by service name, display name, or executable path.
- No default PostgreSQL installation directory or PostgreSQL-named immediate directories in checked common user tool locations were found.
- A Windows Package Manager inventory did not complete: its Microsoft Store source required agreement/region handling, so the command was stopped without completing that inventory.

**Assessment:** no native PostgreSQL installation was detected by these checks (high confidence for standard/registered installs). This is not proof of absence from every nonstandard folder, another user profile, or an unqueried volume. A broad whole-drive executable scan was not completed. No server was started and no database connection was attempted; therefore, usability and server version could not be verified. No PostgreSQL version is confirmed installed.

### Recommended exact package versions

These are compatible release candidates recommended for an initial version baseline as of the assessment date. They are not claims that packages were installed or build-tested.

| Package | Recommended version | Purpose and compatibility evidence | Official source |
|---|---:|---|---|
| Node.js | `24.22.1` LTS | Meets Nest CLI generator minimum `24.15+`, Next.js minimum `20.9+`, and Prisma 7's Node `>=24.0` range. | [Node.js release](https://nodejs.org/en/blog/release/v24.22.1); [release index](https://nodejs.org/dist/index.json) |
| npm | `11.19.1` | This is the npm version paired with Node `v24.22.1` in the official Node.js distribution index; its package metadata supports Node `^20.17 || >=22.9.0`. npm workspaces fit the approved repository approach. | [Node.js release index](https://nodejs.org/dist/index.json); [npm 11.19.1 metadata](https://registry.npmjs.org/npm/11.19.1); [npm 11 workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces) |
| `next` | `16.4.3` | Stable `latest` tag at review time; package metadata requires Node `>=20.9.0` and accepts React `^19.0.0`. | [Package metadata](https://registry.npmjs.org/next/16.4.3); [Next.js installation requirements](https://nextjs.org/docs/app/getting-started/installation) |
| `react`, `react-dom` | `19.3.1` each | Stable package versions. Next accepts React 19; `react-dom@19.3.1` declares React `^19.3.1`, so the pair matches. | [React](https://registry.npmjs.org/react/19.3.1); [React DOM](https://registry.npmjs.org/react-dom/19.3.1); [Next.js metadata](https://registry.npmjs.org/next/16.4.3) |
| `@types/react`, `@types/react-dom` | `19.3.0` each | TypeScript declarations for React 19; React DOM types require `@types/react ^19.3.0`. | [React types](https://registry.npmjs.org/%40types%2Freact/19.3.0); [React DOM types](https://registry.npmjs.org/%40types%2Freact-dom/19.3.0) |
| `@types/node` | `24.19.2` | Node 24 type declarations; Nest Swagger's published development metadata uses this release. | [Package metadata](https://registry.npmjs.org/%40types%2Fnode/24.19.2); [Nest Swagger metadata](https://registry.npmjs.org/%40nestjs%2Fswagger/12.0.5) |
| `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` | `12.3.1` | Matching Nest framework versions. Core and platform metadata accept Nest 12 peers; platform-express includes Express 5. | [Core](https://registry.npmjs.org/%40nestjs%2Fcore/12.3.1); [common](https://registry.npmjs.org/%40nestjs%2Fcommon/12.3.1); [Express platform](https://registry.npmjs.org/%40nestjs%2Fplatform-express/12.3.1) |
| `@nestjs/cli` | `12.0.11` | CLI candidate; its metadata requires Node `>=20.11`, while Nest's current generator prerequisite is stricter at `24.15+`. It depends on TypeScript `~6.0.2`. | [CLI metadata](https://registry.npmjs.org/%40nestjs%2Fcli/12.0.11); [NestJS prerequisites](https://docs.nestjs.com/first-steps.md) |
| `@nestjs/testing` | `12.3.1` | Matching optional Nest testing package for later test setup. | [Package metadata](https://registry.npmjs.org/%40nestjs%2Ftesting/12.3.1) |
| `rxjs`, `reflect-metadata` | `7.8.2`, `0.2.2` | Satisfy Nest core peer ranges (`rxjs ^7.1.0`, reflect-metadata `^0.1.12 || ^0.2.0`). | [RxJS](https://registry.npmjs.org/rxjs/7.8.2); [reflect-metadata](https://registry.npmjs.org/reflect-metadata/0.2.2); [Nest core metadata](https://registry.npmjs.org/%40nestjs%2Fcore/12.3.1) |
| `@nestjs/swagger` | `12.0.5` | Optional recommendation if OpenAPI is selected; metadata accepts Nest `^12.0.0` and TypeScript `^5.5.0 || ^6.0.0`. | [Package metadata](https://registry.npmjs.org/%40nestjs%2Fswagger/12.0.5) |
| `typescript` | `6.0.3` | Recommended shared compiler baseline: satisfies Nest CLI's `~6.0.2`, Swagger's `^6.0.0`, and Prisma ORM 7's minimum `5.4+`. Next documents TypeScript 7 support too, but this set avoids using TS 7 where Swagger's peer range excludes it. | [Package metadata](https://registry.npmjs.org/typescript/6.0.3); [Next.js TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript); [Prisma 7 requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements) |
| `prisma`, `@prisma/client`, `@prisma/adapter-pg` | `7.10.1` each | Keep Prisma CLI, Client, and PostgreSQL adapter on the same 7.10.1 release. Prisma 7.10.1 supports Node `^20.19 || ^22.12 || >=24.0`. Registry tags at review time pointed `prisma@latest` to `8.0.0-rc.27` and `prisma@prev` to `7.10.1`; do not use unqualified `latest` for the approved Prisma 7 direction. | [Prisma 7.10.1](https://registry.npmjs.org/prisma/7.10.1); [Client 7.10.1](https://registry.npmjs.org/%40prisma%2Fclient/7.10.1); [PostgreSQL adapter 7.10.1](https://registry.npmjs.org/%40prisma%2Fadapter-pg/7.10.1); [NestJS Prisma recipe](https://docs.nestjs.com/recipes/prisma.md) |
| `pg` | `8.23.1` | PostgreSQL Node driver used by Prisma's documented `@prisma/adapter-pg` path; adapter metadata requires `pg ^8.16.3`, which includes 8.23.1. | [Driver metadata](https://registry.npmjs.org/pg/8.23.1); [adapter metadata](https://registry.npmjs.org/%40prisma%2Fadapter-pg/7.10.1); [Prisma PostgreSQL setup](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql) |

Registry `latest` tags are not uniformly stable: at review time, Prisma `latest` pointed at a release candidate, and TypeScript `latest` pointed at 7.0.2. The exact pins above were checked individually against package metadata and relevant peer/engine constraints instead of inferred from a single `latest` tag. Recheck release status and security updates before implementation.

### Compatibility matrix

| Component | Published requirement / relationship | Recommended candidate | Result |
|---|---|---|---|
| Next.js | Node `>=20.9`; React peer includes `^19.0.0` | Node `24.22.1`, React/React DOM `19.3.1`, Next `16.4.3` | Meets stated Node and peer ranges |
| NestJS runtime | Node `20.19+` or `22.12+` | Node `24.22.1`, Nest `12.3.1` | Meets documented runtime requirements |
| NestJS CLI generators | Node `22.22.3+`, `24.15+`, or `26+` | Node `24.22.1`, CLI `12.0.11` | Meets documented generator requirement |
| npm workspaces | npm 11 supports root `package.json` workspaces | npm `11.19.1` bundled with Node `24.22.1` | Supported; one root lockfile recommended |
| TypeScript | Nest CLI `~6.0.2`; Swagger `^5.5 || ^6`; Prisma 7 `5.4+` | TypeScript `6.0.3` | Nest/Swagger/Prisma declared ranges align; Next type-check not run |
| Prisma ORM 7 | Node `^20.19 || ^22.12 || >=24`; matched CLI/client versions recommended | Prisma packages `7.10.1` on Node `24.22.1` | Meets published Node range; not integration-tested |
| PostgreSQL adapter | `@prisma/adapter-pg@7.10.1` depends on `pg ^8.16.3` | `pg@8.23.1` | Satisfies declared driver range; not connection-tested |

Sources: [Next.js requirements](https://nextjs.org/docs/app/getting-started/installation), [NestJS prerequisites](https://docs.nestjs.com/first-steps.md), [Node.js release schedule](https://nodejs.org/en/about/previous-releases), [npm workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces), [Prisma 7 system requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements), and the exact npm package metadata linked in the version table.

The Next.js documentation describes built-in TypeScript support, but the inspected Next package metadata does not declare a TypeScript peer range. The proposed TypeScript `6.0.3` is supported by the Nest CLI/Swagger ranges and Prisma 7 minimum; a Next.js project type-check remains to be verified after scaffolding.

### Development-environment support assessment

Assessment date: 2026-10-27. These are read-only findings for the existing PC; they do not establish that an operating-system upgrade or any software installation is authorized.

**Confirmed local facts**

- Windows 10 Pro, version 22H2, build 19045 (64-bit). Windows 10 standard support ended on 2025-10-14.
- Lenovo system model `20F5S1KQ00`, Intel Core i5-6200U (2 cores / 4 logical processors), approximately 8.46 GB RAM, and approximately 392 GB free on C:.
- The CPU is a 6th-generation Intel Core i5. Microsoft's supported Windows 11 Intel processor list includes the 8th-generation Core i5 family and later generations shown in the list, but not this CPU. Therefore, this PC does not meet the supported-CPU requirement for a standard Windows 11 upgrade. Other Windows 11 criteria do not override that CPU requirement.
- Firmware virtualization was reported disabled; SLAT was reported available; no hypervisor was detected. `wsl.exe` exists, but its status/list commands did not verify WSL 2 readiness or an installed distribution. Docker, VMware, and VirtualBox executables were not found via PATH; this does not prove they are absent elsewhere.
- TPM status could not be queried because access was denied, and Secure Boot status could not be checked without required privileges. These remain unknown, not confirmed absent.
- No other local computer or usable remote development host was established by the checks in this assessment.

**Servicing and platform implications**

- Microsoft offers consumer Windows 10 ESU for eligible Windows 10 22H2 devices through 2027-10-12. Enrollment status on this PC was not checked. ESU provides critical and important security updates, not general feature fixes or technical support; the consumer program cannot be used in commercial scenarios. Confirm eligibility and enrollment in Windows Update before relying on ESU.
- PostgreSQL 18 documentation says current versions of Windows and Linux are expected to work, but does not establish support for this Windows 10 installation after Windows 10's standard support ended. Do not treat PostgreSQL 18.6 on this PC as a verified supported combination.
- VS Code Remote - SSH supports development on a remote Linux host; PostgreSQL documents current Linux versions as expected supported platforms. A specific remote host, distribution, service level, and cost have not been selected or verified.

Sources checked 2026-10-27: [Windows 10 lifecycle](https://learn.microsoft.com/en-us/lifecycle/products/windows-10), [consumer Windows 10 ESU](https://www.microsoft.com/en-us/windows/extended-security-updates), [Windows 11 requirements](https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements), [supported Intel processors for Windows 11](https://learn.microsoft.com/en-us/windows-hardware/design/minimum/supported/windows-11-supported-intel-processors), [PostgreSQL 18 supported platforms](https://www.postgresql.org/docs/18/supported-platforms.html), and [VS Code Remote - SSH requirements](https://code.visualstudio.com/docs/remote/ssh).

**Options and recommendation**

| Option | Benefits | Trade-offs / status |
|---|---|---|
| Continue on this PC with Windows 10 ESU, if eligible | Avoids an immediate hardware purchase; can be a short transition period. | ESU enrollment and commercial eligibility are unknown; coverage is security updates only and ends 2027-10-12. Windows 11 does not have a supported upgrade path on this CPU, and PostgreSQL 18 support on this Windows 10 installation is unverified. Not recommended as the long-term host for PostgreSQL 18. |
| Use or acquire a Windows 11-eligible local PC | Fully local development and database, no ongoing remote-compute charge, and simpler offline work. | No eligible spare PC was confirmed. Reusing or buying one requires checking the exact CPU, TPM 2.0, Secure Boot capability, storage, licensing, and development workload; acquisition may have a significant one-time cost. |
| Use a remote Linux development host over VS Code Remote - SSH | Avoids replacing this PC immediately; current Linux is a documented PostgreSQL platform, and Node/Nest/Next development can run on the host. | No host is currently available or verified. Compute, storage, backups, networking, secure SSH access, and ongoing charges need an approved design and budget; the local Windows client still needs a security plan. |

**Recommendation at that assessment:** Do not install PostgreSQL 18.6 on this PC yet. The remote-host preference below is superseded by the follow-up comparison, which considers Ubuntu LTS on the owner's only computer.

### Follow-up: Ubuntu LTS versus Windows 10 ESU

Assessment date: 2026-10-27. The owner clarified that the Lenovo is the only computer. This assessment compares options but does not approve an OS change, ESU enrollment, PostgreSQL installation, or boot-media creation.

**Read-only hardware inventory**

- Confirmed Windows reports Lenovo model `20F5S1KQ00`, Intel Core i5-6200U, 8,455,311,360 bytes RAM (about 8.46 GB), and 391,973,642,240 bytes free on C: (about 392 GB).
- Detected devices: Broadcom 802.11ac Wireless PCIe adapter, PCI ID `14e4:43ec` (BCM4356); Intel HD Graphics 520; Realtek High Definition Audio; Intel Display Audio; Intel Ethernet Connection I219-V; AC adapter and two ACPI battery devices.
- Windows device enumeration does not establish Linux driver behavior. Battery health/runtime and BIOS version were not reliably obtained; no Ubuntu live test was performed.

**Ubuntu feasibility and device-specific uncertainties**

- Canonical's current Ubuntu Desktop release page identifies Ubuntu 26.04.1 LTS and lists a 2 GHz dual-core CPU, 6 GB RAM, and 25 GB free disk as minimum requirements. The reported CPU, RAM, and free disk meet these figures on paper. This is a minimum, not a performance guarantee: the machine has only 2 CPU cores and about 2.46 GB RAM above the desktop minimum, so running an IDE, browser, Next.js, NestJS, and PostgreSQL together may be resource-constrained. No workload benchmark was performed.
- Canonical lists Ubuntu 26.04 LTS standard security maintenance through May 2031; optional Ubuntu Pro extends coverage. This is a supported long-term release, unlike Ubuntu interim releases with nine months of updates.
- The approved FolkTuk stack is technically feasible on 64-bit Ubuntu: the official Node.js archive provides Node 24.22.1 Linux x64 and npm 11.19.1; Next.js lists Linux and Node 20.9+; Prisma ORM 7 lists Node 24 and Linux support; PostgreSQL 18 lists current Linux versions as expected supported platforms. Prisma also requires Linux runtime libraries (including OpenSSL, zlib, libgcc, and glibc). These published requirements indicate feasibility, not a tested or built stack on this laptop.
- The BCM4356 is listed by Linux Wireless documentation as supported by the open-source `brcmfmac` driver, but that driver requires firmware. Whether the firmware is present and the Lenovo-specific wireless behavior works should be checked in a live session, including reconnects and 2.4/5 GHz if available. This is a test point, not a confirmed blocker.
- The Intel graphics and Realtek/Intel audio devices were identified, but hardware-specific Ubuntu behavior was not verified. Test display resolution, graphics/video, audio input/output, brightness controls, external display, suspend/resume, lid-close wake, Wi-Fi reconnect, Ethernet, charging, and battery drain. Firmware version/behavior and battery condition remain unknown.
- No matching ThinkPad T460 certification record was established from the Canonical certified-device lookup. That is not proof of incompatibility or of absence from every catalog result. Lenovo's T460 product/specification material documents model-family configurations; the exact subcomponents and firmware may vary.
- The reported 392 GB free is Windows free space, not unallocated disk space. A dual-boot install would require partition changes and cannot be planned from that number alone.

**Comparison**

| Consideration | Windows 10 Pro 22H2 with Consumer ESU | Ubuntu 26.04 LTS on this Lenovo |
|---|---|---|
| Cost | ESU can be no-extra-cost via eligible settings backup, 1,000 Microsoft Rewards points, or a one-time USD $30/local equivalent plus tax. Eligibility and region-dependent options must be checked. | Ubuntu is free to use; evaluation can be free only if suitable USB media is already available. Future media, backup storage, and owner time may have costs. |
| Security updates | Windows 10 standard support ended 2025-10-14. Eligible Consumer ESU provides only critical/important security updates through 2027-10-12, not feature fixes or technical support. It is not for commercial scenarios. | Ubuntu 26.04 LTS standard security maintenance is listed through May 2031; updates require connectivity. |
| Legitimacy | Windows 10 22H2 Pro is an eligible edition/version category, but the latest Windows update and required KB5126256, admin non-child Microsoft account, device enrollment state, and non-commercial-use condition must be satisfied. Actual eligibility/enrollment was not checked. | No ESU enrollment is needed. Canonical's minimum resource requirements are met on paper; actual laptop compatibility is unverified. |
| Performance | Avoids an OS migration on this low-core/8 GB system; no performance measurement was made. | Meets Ubuntu's published minimum only modestly for memory and CPU. Desktop plus the full local development stack may feel constrained; measure with the actual workflow before committing. |
| Unreliable internet | Existing Windows can continue offline, but ESU delivery and npm dependencies require connectivity at relevant times. | Live evaluation and initial setup require prepared media; system and dependency updates/downloads need connectivity. After provisioning, local development and PostgreSQL can run offline, subject to cached dependencies. |
| Usability and recovery | Keeps current environment and files intact; simplest short-term option if Consumer ESU eligibility is confirmed. | Linux is a natural fit for the approved Node/PostgreSQL stack, but device drivers and daily usability need testing. Replacing Windows has greater recovery risk; dual boot also requires partitioning and can affect boot/recovery. |

Microsoft's Consumer ESU page says the consumer program cannot be used in commercial scenarios and excludes certain managed/domain/MDM devices. FolkTuk's intended use and this PC's management/enrollment status were not assessed; do not assume eligibility. Check Windows Update's offer and program terms without selecting **Enroll now**.

### Read-only Windows 10 Consumer ESU evidence check

Check date: 2026-10-27. No update scan, enrollment, account sign-in, purchase flow, settings change, or software installation was initiated.

- Confirmed OS edition and release: Windows 10 Pro, version 22H2, build 19045. This satisfies Microsoft's edition/version category, but does not establish overall eligibility.
- Cached Windows Update Client operational events include successful scans at 2026-10-27 13:06 reporting one update found, and update-download events earlier that day. A scan earlier on 2026-10-27 also logged error `0x80240438`. These records are history, not a fresh status check; they do not establish which update was found, whether it remains pending, or whether the installation is fully current.
- `wuauserv` was Stopped with Manual start mode at query time. This observation alone does not establish a fault or that Windows Update cannot run.
- `Get-HotFix` did not list KB5126256. It did list KB5126657 as a Security Update installed 2026-10-20, after Microsoft's October 14, 2025 threshold, and a later KB5127689 entry dated 2026-10-21. However, the hotfix inventory is not a complete servicing-package verification. The authoritative online servicing-package inventory (`Get-WindowsPackage -Online`) could not run because elevation was required. Therefore KB5126256 installation is **not confirmed**, and the threshold security-update prerequisite is only supported by the available hotfix record, not independently verified against the complete component-store inventory.
- No account identity, admin/child-account status, ESU enrollment, Windows Update offer, domain/MDM management state, or intended-use eligibility was established. The computer reports WORKGROUP and is not domain-joined; the MDM enrollment registry root exists, which is not sufficient to determine whether it is enrolled in device management. Do not infer eligibility or non-enrollment from these limited indicators.

Microsoft's [KB5126256 support article](https://support.microsoft.com/en-us/servicing/os/windows-10/2026/09/kb5126256-windows-10-21h2-22h2-standalone-cbs) identifies this as the required ESU licensing preparation package for Windows 10 22H2. It must follow a security update released on or after 2025-10-14; installing KB5126256 alone neither enrolls the PC nor provides ESU updates. Microsoft's [Consumer ESU program page](https://www.microsoft.com/en-us/windows/extended-security-updates) separately requires an eligible 22H2 edition, latest Windows update, an administrator Microsoft account that is not a child account, and excludes commercial scenarios and certain managed devices. Only the edition/version category is confirmed here; this is insufficient to say that the owner or FolkTuk use qualifies.

**Safest next step:** Do not install KB5126256, enroll, or initiate a purchase based on this evidence. If the owner later authorizes further checking, first review the existing Windows Update page without choosing **Enroll now** or **Purchase**, and confirm the applicable Microsoft account/device conditions and whether FolkTuk's intended development use is non-commercial under Microsoft's terms. If definitive KB package status is required, use a properly authorized read-only servicing inventory; elevation was not available during this check.

### Read-only recovery readiness assessment

Assessment date: 2026-10-27. No recovery, encryption, partition, boot, backup, or activation settings were changed; no keys were read or displayed.

- **Windows location:** Windows 10 Pro 22H2, build 19045, reports `C:\WINDOWS` and system drive `C:`.
- **Encryption:** `Get-BitLockerVolume` and `manage-bde -status` could not read volume status because administrative access was denied. Device encryption/BitLocker state is **unknown**; this is not evidence that encryption is off. No recovery key was retrieved.
- **Windows Recovery Environment:** `reagentc /info` required an elevated prompt and returned access denied. A 528 MB NTFS partition with GPT Recovery type is present on Disk 0, but that does not confirm WinRE is enabled, configured, or usable. WinRE status remains **unknown**.
- **Physical storage and partitions:** One physical disk was visible: Disk 0, HGST HCC545050A7E630, SATA, GPT, online/healthy, approximately 500 GB. It contains a 528 MB Recovery partition, 100 MB EFI System partition, 16 MB Microsoft Reserved partition, and the 499 GB NTFS `C:` Windows volume. C: had approximately 392 GB free. These are existing partitions, not proposed changes.
- **Separate backup destination:** Only the internal C: fixed disk was visible in the logical-disk inventory. No separate backup destination was detected at assessment time. This does not establish whether a backup exists elsewhere; a connected USB/network destination and a verified backup were not confirmed.
- **Activation:** `slmgr.vbs /xpr` reported Windows Professional as permanently activated. No product key was read or displayed. This verifies activation status only, not ownership of a recovery image or the ability to restore Windows.

Before any media creation, the owner must manually confirm that a separate backup exists and can be restored, that Windows recovery/installation media or another usable recovery method is available, whether BitLocker/device encryption is on, and that its recovery key is retrievable and safely stored outside the laptop. For definitive WinRE and encryption status, an appropriately authorized elevated read-only query is needed; do not enable, disable, suspend, or decrypt anything during that check. No backup or recovery method was tested.

#### Non-elevated recovery readiness follow-up

Assessment date: 2026-10-27. The current Windows account's token lists the local Administrators group as **deny only**, and the process has a **medium integrity** level; it is not running elevated. The account appears to be in the local Administrators group, but its current process does not have active administrator privileges. No account name or SID is recorded here.

A non-elevated `reagentc /info` query returned error 5 and stated that it can only run from an elevated command prompt. WinRE status therefore remains unknown. No configuration was changed.

Owner verification guidance:

- To check encryption through Windows UI without exposing any key, open **Control Panel > System and Security > BitLocker Drive Encryption** and inspect the OS drive's status only. Do not select actions to turn BitLocker on/off, suspend protection, decrypt, or back up/display a recovery key. If the interface is unavailable or reports access restrictions, leave status unknown rather than changing anything.
- To check WinRE, its configuration status requires an elevated, read-only `reagentc /info` query on this installation; the non-elevated query is insufficient. Review only the Windows RE status/location, not any unrelated output. Do not run `reagentc /enable`, `/disable`, or other modifying commands. If elevation is unavailable or the owner is unsure, defer the check.
- If encryption is enabled, verify privately through Windows' built-in recovery-key management UI that the correct recovery key is retrievable and stored in a safe location separate from the laptop. Do not copy, paste, photograph, or transmit the key to a terminal, project file, or chat. Do not share the key during any later verification.
- A separate backup means a second copy on a different physical device or a reputable backup destination, not another folder/partition on the same internal disk. Confirm it contains the important project and personal files, and verify recovery by opening or restoring representative files to a temporary location. A connected drive alone is not proof of backup. Do not use a USB stick containing the only copy of files as Ubuntu media; its contents must first be independently backed up or confirmed safely disposable.

Minimum prerequisites before considering Ubuntu media creation remain: a verified off-device backup and successful sample restore; a known Windows recovery method; known encryption state and, if encrypted, a privately retrievable off-device recovery key; and a suitable USB whose contents are backed up or disposable. None of these prerequisites was confirmed by this read-only check.

**Safe evaluation and recovery precautions**

Canonical's “Try Ubuntu Desktop” procedure runs from USB without installing and says it does not change the computer configuration. A live session is the lowest-risk practical hardware test, but it does not prove installation, updates, long-term battery/suspend reliability, or dual-boot safety. The current task did not download Ubuntu, create media, change boot settings, or boot a live environment. If later approved, use trusted official media already available or prepare it only with separate authorization; boot through the one-time boot menu and select **Try Ubuntu**, never an install option. Do not change BIOS/UEFI settings or partitions during evaluation, and do not write to the Windows volumes.

Before any later OS installation or partition change: make and verify a separate full backup of project and personal data; ensure Windows recovery/installation media is available and its recovery path is understood; locate and safely retain the BitLocker recovery key if encryption is enabled; confirm the Windows license/activation and current disk/partition layout; keep the original Windows recovery partitions; and proceed only with a reviewed plan and owner approval. Do not treat free space inside C: as an allocated Ubuntu partition. No backup or recovery action was performed in this assessment.

Sources checked 2026-10-27: [Ubuntu Desktop download and system requirements](https://ubuntu.com/download/desktop), [Ubuntu release cycle](https://ubuntu.com/about/release-cycle), [Ubuntu 26.04 release notes](https://documentation.ubuntu.com/release-notes/26.04/), [Ubuntu Try Desktop guide](https://documentation.ubuntu.com/desktop/en/latest/tutorial/try-ubuntu-desktop/), [Lenovo ThinkPad T460 specifications](https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_T460/ThinkPad_T460_Spec.PDF), [Canonical certified-device catalog](https://ubuntu.com/certified), [Linux Wireless Broadcom driver support and firmware notes](https://wireless.docs.kernel.org/en/latest/en/users/drivers/brcm80211.html), [Node.js 24.22.1 archive](https://nodejs.org/en/download/archive/v24.22.1), [Next.js system requirements](https://nextjs.org/docs/app/getting-started/installation), [Prisma ORM 7 system requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements), [PostgreSQL 18 supported platforms](https://www.postgresql.org/docs/18/supported-platforms.html), and [Microsoft Windows 10 Consumer ESU](https://www.microsoft.com/en-us/windows/extended-security-updates).

#### Proposed no-install live-test plan (not performed)

Canonical's current Ubuntu Desktop page recommends Ubuntu **26.04.1 LTS**, supports Intel/AMD 64-bit architecture, and lists minimums of a 2 GHz dual-core CPU, 6 GB RAM, and 25 GB free disk. The ThinkPad's reported Core i5-6200U, 8 GB RAM, and Windows 64-bit installation meet the CPU/RAM/architecture thresholds on paper. The 25 GB figure is an installation requirement; the reported 392 GB free inside C: is not unallocated space and does not establish that Ubuntu can be installed. Canonical's live-test guide recommends an 8 GB-or-larger USB flash drive; writing the image erases that drive.

Before any media creation is separately approved, verify:

- A full backup of project and personal files exists on separate storage, and selected files can be opened/restored.
- The Windows recovery method is known and usable; recovery/installation media is available if needed.
- Whether BitLocker/device encryption is enabled and whether its recovery key is retrievable and safely stored outside this laptop. Do not disclose the key.
- A suitable USB drive is available, its contents are backed up, and it can be erased without losing the only copy of anything.
- Another device is not inherently required if this Lenovo can later prepare the media after authorization or if prepared media already exists. It may be needed only if this Lenovo cannot safely prepare media or an online-only recovery key cannot otherwise be verified.

If approved later, use the official Ubuntu 26.04.1 LTS image and Canonical's live-preview guide. Shut down Windows normally, use the one-time boot-device menu (F12 is common on PCs; verify the Lenovo-specific key), and select USB without changing persistent boot order or other firmware settings. If USB boot requires firmware changes or is blocked, stop and request approval. At the Ubuntu menu choose **Try Ubuntu**, never installation; if that option is unavailable, stop. Do not click the desktop installer, select partitioning/install options, access Windows volumes, or accept update/driver installation prompts. Canonical says the preview makes no permanent PC changes and uses open-source drivers only; missing proprietary drivers can make a live test a false negative. When finished, restart from the live desktop, remove the USB when prompted, and verify Windows starts normally.

Preview checklist (record observations externally, without writing to Windows volumes):

- **Wi-Fi:** Detect adapter; connect to a trusted network; check browsing, stability, disconnect/reconnect, and available 2.4/5 GHz bands. Broadcom BCM4356 may require firmware; preview failure is not conclusive evidence against an installed system. Compare Ethernet if available.
- **Audio:** Test speakers/headphones at moderate volume and microphone input without recording sensitive material.
- **Graphics/display:** Check resolution/scaling, brightness keys, flicker/artifacts, video playback, and an already-available external display.
- **Keyboard/touchpad:** Check keys and Fn controls, TrackPoint, touchpad, buttons, scrolling, and gestures.
- **Battery/charging:** Check AC/battery recognition, charging state, and unexpected power loss. Live-session battery estimates are not a battery-health test.
- **Suspend/resume:** On AC with no unsaved work, test suspend/resume and lid close/open once. Stop if it does not wake reliably.
- **Responsiveness:** Use the desktop, settings, and bundled browser; note lag, fan noise, heat, or freezes. Do not install/run FolkTuk's stack; 8 GB only modestly exceeds Ubuntu's 6 GB minimum, so this is not a full development workload benchmark.

Sources checked 2026-10-27: [Ubuntu Desktop requirements](https://ubuntu.com/download/desktop), [Ubuntu 26.04 lifecycle](https://ubuntu.com/about/release-cycle), [Try Ubuntu Desktop 26.04 LTS](https://documentation.ubuntu.com/desktop/en/latest/tutorial/try-ubuntu-desktop/), and [Create a bootable USB](https://documentation.ubuntu.com/desktop/en/latest/how-to/create-a-bootable-usb-stick/).

**Recommendation / lowest-cost next step:** Do not choose or install an operating system yet. First, without enrolling, check Windows Update and the Microsoft account/device conditions to establish whether Consumer ESU is legitimately available for the intended use. In parallel, check that an independent backup and Windows recovery path already exist. If Ubuntu remains preferred, the next compatibility check should be a no-install live session from already available or later owner-approved official media; no such media was confirmed available here. This preserves the existing Windows setup while answering the main hardware questions before any disk change.

## Recommended initial repository structure

This structure is recommended only; no files or directories were created:

- `apps/web` — Next.js frontend.
- `apps/api` — NestJS backend as one modular monolith, organized around domain modules.
- `packages/` — omit initially; add only for a clear shared contract/client or tooling need.
- Root `package.json` — npm workspace declaration and shared scripts/configuration as appropriate.
- Root `package-lock.json` — one lockfile for reproducible workspace installs.
- API contract — versioned and documented; OpenAPI via `@nestjs/swagger` is a recommendation for approval, not a confirmed choice.
- Prisma migration history — reviewable SQL migrations committed alongside the application schema and source-controlled with the project.

One repository supports coordinated frontend/API changes and shared TypeScript tooling while keeping the applications independently buildable and deployable. Avoid sharing server internals with the browser application or splitting the API into microservices.

## Remaining blockers and decisions requiring approval

### Prerequisites before scaffolding

1. Replace the installed, EOL Node `21.7.1` with an approved Node 24 LTS release; `24.22.1` is the candidate assessed here. The expected bundled npm is `11.19.1`.
2. Resolve the development environment before PostgreSQL setup. Compare legitimate Consumer ESU on Windows with Ubuntu LTS after a live hardware test; Consumer ESU eligibility, Ubuntu device behavior, and the backup/recovery path remain unverified. No local PostgreSQL installation was detected, and PostgreSQL 18 support on this Windows 10 installation was not verified. Do not install PostgreSQL 18.6 until an environment and recovery plan are approved.
3. Before implementation, recheck exact package releases and security advisories. The compatibility matrix is metadata-based only and has not been validated by installation, build, or runtime tests.
4. If npm registry lookups are unavailable during setup, use pinned versions and a reviewed lockfile; do not silently substitute unqualified tags.

### Open project decisions

1. **API contract:** Approve OpenAPI/REST and a versioning convention, or specify an alternative contract and documentation approach.
2. **Development environment and PostgreSQL setup:** Confirm Consumer ESU legitimacy/eligibility or approve a future Ubuntu live evaluation, then decide whether Windows or Ubuntu is the development host. Verify backup/recovery readiness before any OS change. Confirm PostgreSQL 18.6 on the selected OS before database installation. This PC's Windows 11 CPU eligibility is not met; TPM/Secure Boot remain unverified.
3. **Authentication:** Evaluate and select an authentication implementation.
4. **Database operations:** Confirm database backup/reset expectations and migration execution policy for development and deployment.
5. **Local testing:** Agree on test tiers and tools; a reasonable starting recommendation is per-app unit tests plus isolated PostgreSQL-backed integration tests.
6. **Object storage and background processing:** Select an S3-compatible storage provider and determine the approach to background processing.
7. **Hosting and deployment:** Validate costs and determine deployment architecture, including whether DigitalOcean is suitable. Pricing and production services were not assessed.

## Assessment boundaries

The native PostgreSQL investigation queried PATH, common installation directories, Windows uninstall and PostgreSQL registry entries, and PostgreSQL-related Windows services. It did not scan every file on every volume, inspect all user profiles, or connect to a database. The environment assessment used read-only Windows/hardware queries and official documentation; TPM and Secure Boot checks were limited by permissions. No software was installed, upgraded, uninstalled, configured, or started; no credentials were read or changed; no production service was accessed; and no application tests were run.

## Read-only backup inventory

Assessment date: 2026-10-27. A metadata-only scan counted 15,862 files (6.29 GB / 5.85 GiB) in selected user folders. It found FolkTuk at `C:\Users\USER\Projects\FolkTuk` (3 files), NOVEX DOC Network at `C:\Users\USER\Local Sites\novex-doc-network` (5,826 files), its test/rollback copy at `C:\Users\USER\Local Sites\novex-bank-review-test` (8,431 files), and `C:\Users\USER\tipshore-app` (1,166 files). Downloads account for 5.49 GiB. The scan found 1,263 photo/image files, 623 graphics/design files, and one audio recording; no video files were found in the traversed folders.

NOVEX has four `wp-config.php` files, SQL exports, and local MySQL data under `C:\Users\USER\AppData\Roaming\Local\run` (541 files, 684 MB). Local configuration and database files include credentials and private keys; their contents were not read. Treat these as essential but sensitive, back them up only to an approved protected destination, and use an application-consistent database export or approved stopped-service procedure. The surrounding LocalWP data totals 3.51 GB, including 2.75 GB of runtime files that may be regenerable. No Git repository, `.gitignore`, or `.env` file was found in the inspected project trees; ignored/hidden files were not treated as disposable.

The measured folders plus the full LocalWP application-data folder total about 9.80 GB, apparently within the stated approximately 14.98 GB Drive allowance, but neither Drive nor the Google account was accessed. This is not a whole-PC image estimate: OneDrive/known-folder reparse directories were not traversed, other application/browser profiles were not inventoried, and Windows/system files and installed software were not counted. Desktop and Pictures are absent as ordinary local folders. No destination or restore test was confirmed.

Before any backup is prepared, decide: (1) which verified off-device destination to use and whether to retain a separate encrypted copy for secrets; (2) whether to include the full LocalWP runtimes and browser/application profiles; (3) the purpose and retention of large Downloads archives/installers; (4) how to capture the active NOVEX databases consistently; (5) whether to resolve and include OneDrive placeholders; and (6) whether a separate Windows/system-image and recovery plan is required. No user data was copied, archived, or uploaded; only this summary was added to this document.
