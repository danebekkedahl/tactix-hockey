# CONTEXT.md — Synapz Hockey Fast-Map & Architecture Index

> **Purpose:** Lightweight (~100-line) architectural index for **SYNAPZ HOCKEY — PLAY. LEARN. DOMINATE.** so all agents (`Main App Code Page`, `Playtest-Agent`, `Council-Agent`, and `3-Pod / 10-Seat Board`) can locate Supabase tables, DOM containers/modals, and core functions in `<1 second`. Always read alongside `CHANGELOG_DECISIONS.md`.

---

## 1. Supabase Cloud Tables (`https://jrusjgpfcnptozfehcrv.supabase.co/rest/v1`)
All frontend calls use publishable anon key `sb_publishable_73207-0o-_PJEGLgeiZSog__PwUgTxX` (never stage or expose `service_role` or `.tactix_gh_token`).

1. **`public.pucksense_profiles`** (`PuckSenseCloud.fetchProfiles()`, `upsertProfile(prof)`):
   - Columns: `id` (PK, e.g. `dane`, `evan`, `miles`, `rhett`, `whelan`, `cohen`, `amanda`, `sal`), `name`, `last_name`, `age_group` (`8U..18U`), `position` (`C, LW, RW, D, G`), `hand`, `pin_code`, `iq_score`, `puck_bucks`, `streak`, `best_streak`, `current_city_idx`, `unlocked_city_idx`, `avatar_config` (JSONB), `pillar_stats` (JSONB), `concept_stats` (JSONB).
2. **`public.pucksense_teams`** (`PuckSenseCloud.fetchTeamByCode(code)`, `upsertTeam(code)`):
   - Columns: `team_code` (PK, e.g. `PUCK99`, `ASSOC-MINOT`, `ASSOC-FOOTHILLS`), `team_name`, `coach_name`, `weekly_assignments` (JSONB including `coach_customizations`: `roleLabelMap`, `teamPlaybookSystems`, `targetGroup`, `teamJerseyColors`, `teamCoachingPace`, `activeCoachLevel`), `coop_trophy_points`, `roster` (JSONB, max 22-seat cap).
3. **`public.pucksense_agent_inbox`** (`PuckSenseCloud.fetchAgentInbox()`, `postAgentInboxItem()`, `updateAgentInboxStatus()`):
   - Columns: `id` (UUID PK), `created_by` (`Dane`, `Evan`, `Playtest-Agent`, `Council-Agent`), `scenario_id`, `category` (`drill_flag`, `playtest_audit`, `council_spec`, `builder_fixed`), `status` (`open`, `in_council_review`, `queued_for_builder`, `resolved`), `summary`, `details` (JSONB), `created_at`.
4. **`public.tactix_adm_guidelines`** (`PuckSenseCloud.fetchAdmGuidelines()`):
   - Columns: `age_division` (PK: `8U, 10U, 12U, 14U, 16U, 18U`), `division_title`, `allowed_situations`, `prohibited_concepts` (`8U` blocks offsides, 5v4 PP, 4v5 PK, unannounced 3v3), `max_prompt_words` (`8U <= 14 words`), `coach_bob_tone`.
5. **`public.tactix_concept_buckets`** (`PuckSenseCloud.fetchConceptBuckets()`):
   - Columns: `bucket_code` (PK — 15 buckets: `basics_support`, `f1_f2_f3_roles`, `dzone_house`, `offsides_rules`, `breakout_d_to_d`, `rush_attack`, `forecheck_systems`, `powerplay_5v4`, `penaltykill_4v5`, `deception_prescan`, `oz_cycle_scissors`, `nz_regroup_hinge`, `dz_box_plus_one`, `goalie_screen_rebound`, `faceoff_oz_win_play`), `title`, `pillar_key`, `min_age_division`, `prohibited_divisions`.
6. **`public.tactix_scenarios`** (`PuckSenseCloud.fetchCloudScenarios()`, `normalizeCloudScenarioRow()`):
   - Columns: `scenario_key` (PK — **360 QC-approved rows**, 24 per bucket), `bucket_code`, `title`, `age_division`, `allowed_divisions`, `tier_level` (`Rec, B, A, AA, AAA`), `situation_label`, `ice_zone` (`OZ, NZ, DZ`), `target_position` (`C, LW, RW, D, G`), `question_style` (`tap_zone, tap_player, tactical_choice, drag_skater, spot_and_fix`), `coach_bob_prompt`, `scenario_payload` (JSONB), `qc_approved`.
7. **`public.tactix_video_channels`** (`PuckSenseCloud.fetchVideoChannels()`):
   - Columns: `channel_key` (PK — **16 Trusted Channels** across Tier 1 Whiteboard/Drill Creators, Tier 2 NHL/NCAA Telestrator Analysts, Tier 3 Official NHL Broadcasts), `channel_name`, `youtube_handle`, `tier_category`, `primary_styles`, `target_divisions`, `trust_score`, `active`.
8. **`public.tactix_video_library`** (`PuckSenseCloud.fetchCloudVideoLibrary()`, `getMatchingVideoClipsForScenario()`):
   - Columns: `video_key` (PK — **39 QC-approved segments** across all 15 buckets, `>= 2` per bucket, `0` blacklisted IDs), `youtube_video_id`, `channel_key`, `channel_name`, `title`, `bucket_code`, `secondary_buckets`, `allowed_divisions` (`8U` strictly `5v5`), `tier_levels`, `positions`, `situation_tag`, `ice_zone`, `clip_style` (`whiteboard_diagram`, `telestrator_breakdown`, `nhl_live_play`), `start_sec`, `end_sec` (`23s–140s` full-concept teaching windows), `coach_bob_takeaway`, `film_quiz_prompt`, `film_quiz_choices` (JSONB), `embed_verified`, `qc_approved`.

---

## 2. Key DOM Containers & Modals in `index.html`
- **Gate & Onboarding:** `#sandboxLoginModal` (Free-Download 2-Portal Gate + Partner Logo Banner + 4-Tier Pricing `#pricingComparisonModal` + Reviews `#reviewsSuccessModal`), `#loginModal` (5-Step Skater & 360° 3D Avatar Wizard), `#cityIntroModal`, `#tutorialModal`.
- **Full-Viewport Rink Arena (`body.in-game-clean-mode`):**
  - `#rinkRowLayout` -> `#rinkCanvasContainer` (`#rinkCanvas`) + `#rightActionRibbon` (`#btnRibbonCheckPos`, `#btnRibbonNext`, `#btnRibbonMistakeMode`, `#btnRibbonVideo`, `#btnRibbonHint`, `#btnRibbonReset`, `#btnRibbonPov`, `#btnRibbonFullscreen`, `#btnRibbonGuides`, `#btnRibbonFlagDrill`).
  - `#topRinkHudStack` (Zero-overlap vertical flex stack): `#situationContextBanner` (`#situationBannerText`, `#situationTierPill`, `#btnCycleQuestionFormat`, `#btnCueFirstHighlight`) + `#multiFormatControlsBar`.
  - `#coachBobPopup` (`#coachBobAvatarImg`, `#coachCornerFloating`, `#coachBobRoleCalloutBadge`, `#coachBobSituationTag`, `#btnDismissCoachBob`) + `#btnCallCoachBob`.
  - `#tacticalActionDock` (`#dockGroupPreScan`, `#dockGroupDeception`, `#dockGroupComm`, `#dockRoleReadBar`, `#btnOpenRoleGuideModal`) + `#roleGuidePopover`.
  - `#spotMistakeBanner` (2-Step Spot & Fix), `#onIceFeedbackBanner` (`#btnOnIceNextPlay`, `#btnOnIceWatchVideo`, `#btnContrastiveReplay`).
- **Analytics, Pro Lab, Shop, Trophy, Film Room, 4-Tab Player & Coach Portals, & 30-Idea Digest:**
  - `#profileModal` (**4-Tab Player & Family Locker Room**: `#playerPortalTabBar`, `#playerTabContent1` [`#siblingLockerStallsGrid`, `#btnQuickAddSiblingStall`], `#playerTabContent2` [`#avatarPreviewSvgContainer`, `#fittingRoomEquippedSlotsGrid`], `#playerTabContent3` [`#playerTab3PieSvgContainer`, `#playerTab3PositionIqGrid`, `#btnTab3LaunchPip`, `#btnTab3LaunchCustomLesson`], `#playerTabContent4` [`#chkParentLockAgeDivision`, `#familyAllKidsSnapshotGrid`, `#familyHouseCupLeaderboardList`]).
  - `#reportModal` (6-Slice Well-Rounded 100% Balance Pie `#hockeyIqPieSvg`, `#wellRoundedBalanceBadge`, `#positionSpecificIqGrid`, `#ageScaledSelfEvalBox`, `#pieSliceDrilldownDrawer`, `#btnFormulatePipPlan`).
  - `#upgradeModal` (Pro Custom Lesson Builder: `#selectCustomAge`, `#selectCustomManpower`, `#selectCustomSystem` [15 buckets], `#selectCustomPosition` [5 positions]).
  - `#teamManagerModal` (**4-Tab Coach & Director Portal**: `#coachPortal4TabBar`, `#coachTabPanel1` [`#coachKpiCompletionRate`, `#coachKpiAvgIqGain`, `#coachKpiWeakestConcept`, `#coachComplianceAlertTable`], `#coachTabPanel2` [`#selectCoachHomeworkTargetGroup`, `#selectCoachWeeklyFocus`, `#btnApprovePushCoachLesson`], `#coachTabPanel3` [`#coachMultiLevelCustomizationsBox`, `#coachRoleTerminologyPanel`, `#coachTeamSystemPlaybookPanel`, `#coachJerseyAndPacePanel`, `#coachRosterSeatCounterBadge`, `#teamModalLeaderboardList` with `.btn-kick-roster-member`], `#coachTabPanel4` [`#directorAssociationRollupTable`, `#selectDirectorAssociationCode`, `#selectDirectorMonthlyCurriculum`, `#btnDirectorPushCurriculum`, `#directorPushStatusToast`]; `#teamPortalPlayerView`: `#playerCoachInboxCard`, `#playerInboxTargetGroupBadge`, `#playerInboxPlaybookBadge`, `#playerViewTeamLeaderboardList`, `#playerViewCustomLessonLockBanner`, `#teamCoOpCupBox`).
  - `#founderDigestModal` (**30-Idea Board Digest & Authority Flow Modal**: `#btnHeaderFounderDigest`, `#founderDigest30IdeasTableBody`, `.btn-founder-greenlight-idea`, `#btnEmailFounderDigestToDaneEvan`, `#founderDigestEmailToast`).
  - `#proShopModal` (`#shop3dAvatarSvgWrap`, `#proShopItemsGrid`), `#trophyRoomModal` (`#trophyRoom3dCupSvgWrap`, `#trophyRoomCupsGrid`).
  - `#videoExampleModal` (`#videoModalChannelBadge`, `#videoClipStyleBadge`, `#videoClipCounterBadge`, `#btnCycleConceptVideoClip`, `#btnVideoRewind10s`, `#btnReplay12sClip`, `#btnVideoLaunchNativeTelestrator`, `#videoCoachBobTakeawayBox`, `#filmStudyQuizBox`).

---

## 3. Core Functions in `index.html` & Scripts
- **Cloud & Filtering:** `PuckSenseCloud` (`normalizeCloudScenarioRow`, `ingestCloudScenarioRows`, `fetchVideoChannels`, `fetchCloudVideoLibrary`, `fetchTeamByCode`, `upsertTeam`), `isScenarioAllowedForAge()`, `enforceAdmPromptWordLimit()`, `getFilteredScenarios()`, `getCurrentScenario()`, `buildPermutedScenario()`.
- **Cloud Video Library & Film Room:** `getScenarioCanonicalBucketCode()`, `getMatchingVideoClipsForScenario()`, `renderVideoSegmentInModal()`, `openConceptVideoModal()`, `cycleConceptVideoClip()`, `rewindConceptVideo10s()`, `replayConceptVideoSegment()`, `launchCoachBobNativeTelestratorFromVideo()`.
- **Teaching Strategy & Coach Bob:** `showCoachBobPopup()`, `hideCoachBobPopup()`, `setCoachBobAnimationState()`, `getCueFirstHighlightTarget()`, `triggerCueFirstHighlight()`, `triggerContrastiveGoodBadReplay()`, `renderMultiFormatControlsBar()`.
- **Roles, Custom Role Mapper, Canvas & Grading:** `cleanBaseRoleString()`, `getMappedRoleLabel()`, `applyRoleLabelMap(text)` (clean `F1, F2, F3, D1, D2` default + single-label custom swap), `setRoleLabelMap(newMap)`, `refreshAllRoleLabelUI()`, `computeDynamicProximityRoles()`, `drawRink()`, `drawFirstPersonPovRink()`, `checkDraggedPosition()`, `resolveAttempt()`, `recordPlayResult()`.
- **4-Tab Player Portal, 4-Tab Coach Portal & 30-Idea Founder Digest:** `switchPlayerPortalTab()`, `switchSiblingStall()`, `renderPlayerPortal4Tabs()`, `switchCoachPortalTab()`, `renderCoachPortal4Tabs()`, `pushAssociationMonthlyCurriculum()`, `openFounderDigestModal()`, `renderFounderDigestModal()`, `founderGreenLightIdea()`, `dispatchFounderDigestEmail()`, `renderHockeyIqPieChart()`, `computePositionSpecificIqRatings()`, `buildAgeScaledSelfEvaluation()`, `openPieSliceDrilldown()`, `formulateHockeyIqPipPlan()`, `applyCoachLevelPreset()`, `saveAndSyncCoachCustomizations()`, `renderTeamManagerModal()`, `kickRosterPlayer()`, `approveAndPushCoachLessonPlan()`.
- **Automation & Deploy Scripts:** `generate-tactix-bank.js` (3-Bot Scenario Factory -> 360 clean cloud rows), `harvest-tactix-videos.js` (Seat 9 Video Harvester -> 16 channels & 39 verified clips), `send-board-digest.js` (30-Idea Digest Email & Supabase Poster for `danebekkedahl@gmail.com` & `evanbekk@gmail.com`), `deep_playtest_audit.js` (3-Pod / 10-Seat Continuous-Improvement & 5-Persona Playwright Suite — zero `PASS / FAIL` badges), `deploy-github-pages.js` (Pre-commit security scanner + GitHub Pages publisher).
