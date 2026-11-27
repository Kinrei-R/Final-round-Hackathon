# 7-Minute Uncut Demo Script & Verification Checklist

Rule: single take, no cuts. Network OFF from 0:00 (Wi-Fi/Ethernet disabled, visible in the system tray). Terminal + browser side by side.

## Pre-roll (not recorded)
- `uvicorn app:app --host 127.0.0.1 --port 8000` running; browser DevTools -> Network open, "Preserve log" on.
- `git log --oneline -3` ready in a second terminal.

## Timeline

| Time | Screen | Say / Do |
|---|---|---|
| 0:00–0:30 | Terminal | "Network is disabled." Run `ping -c1 8.8.8.8` -> fails. Show server running locally. State keyword **BLUEPINE**. |
| 0:30–1:15 | Browser (Phase 1) | Dataset: 31,320 weekly rows, 60 wards, 5 city corporations, 2016-01-04 -> 2025-12-29. Forecast h = 2, 3, 4 weeks with q10/q90 band. Target median is 0 (p90 cases = 9, max 41) -> Poisson + quantile models. |
| 1:15–2:30 | Deliverable 1: Allocation | Set stock 100% -> 30%. Set crews 120 -> 10. Show priority re-rank and `CRITICAL DEFICIT` alerts. State formula: cases x sqrt(density/max) x (1+water-logging) x (2-sanitation). |
| 2:30–3:30 | Deliverable 2: Overflow | Show ward capacity `max(4, round(p90_beds x 1.15))`, the transfer manifest, net unmet city deficit, and city utilization %. Point out both wards are in the same city corporation; no cross-city transfers. |
| 3:30–4:45 | Deliverable 3: Vector Simulator | Pick a high-priority ward. Run 0, 1, 2, 3 crews. Read cases prevented, beds freed, saline saved, ROI. Note the -65% water-logging cap binds at 3 crews. |
| 4:45–5:45 | Deliverable 4: Dispatch | Open dispatch for `CCC_Ward_03` and `DNCC_Ward_01`. Show SMS length <= 160. Show WhatsApp brief. Open `/exports/` and print preview the Commissioner brief. Reload -> identical text (determinism). |
| 5:45–6:30 | Deliverable 5: Kill-switch | Show banner `MODE: 100% OFFLINE DETERMINISTIC ENGINE`. Click **Offline Kill-Switch & Outbreak Stress Test** with network still off. Show success. Run `grep -rEn "https?://" static/ \| grep -v "127.0.0.1\|localhost"` -> empty. DevTools Network: all requests `127.0.0.1`. |
| 6:30–7:00 | Terminal | `git log --oneline -3` -> each message contains `version-onsite-final`. Show `ARCHITECTURE.md` and `README.md` (grep `BLUEPINE`, `AI Disclosure`). Close. |

## Verification Checklist

**Offline / kill-switch**
- [ ] Network disabled before recording starts and visible on screen
- [ ] `ping` to external host fails on camera
- [ ] Kill-switch button / `/api/stress-test` succeeds while offline
- [ ] `MODE: 100% OFFLINE DETERMINISTIC ENGINE` visible
- [ ] `grep` for external URLs in `static/` returns nothing
- [ ] DevTools Network shows only `127.0.0.1` requests; no CDN or font host

**5 deliverables**
- [ ] 1. Allocation: stock 30%–100% and crews 10–120 both exercised; `CRITICAL DEFICIT` shown
- [ ] 2. Overflow: transfer shown; donor and receiver in the same city corporation
- [ ] 3. Vector simulator: 0, 1, 2, 3 crews run; ROI shown
- [ ] 4. Dispatch: SMS <= 160 chars; WhatsApp brief; printable HTML/PDF brief; reload gives identical output
- [ ] 5. Offline determinism: stress-test and external-URL scan shown

**Documentation / repo**
- [ ] `README.md` contains `BLUEPINE`
- [ ] `README.md` contains `AI Disclosure` section
- [ ] `ARCHITECTURE.md` metrics match: 31,320 rows; 60 wards; 5 cities; 2016-01-04 -> 2025-12-29; cases 0/0/9/41; saline 0/0/21/98; kits 0/0/10/48; beds 0/0/3/12 (min/median/p90/max)
- [ ] Every commit message contains `version-onsite-final`

**Recording**
- [ ] Total length <= 7:00, single take, no edits
