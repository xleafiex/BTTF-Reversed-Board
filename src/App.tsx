import { useState, useEffect, useCallback } from 'react';
import { BugReport, FeatureRequest, ActivePanel } from './types';
import { INITIAL_BUG_REPORTS, INITIAL_FEATURE_REQUESTS } from './data/initialData';
import { sound } from './utils/audio';
import { CrtMonitorFrame } from './components/CrtMonitorFrame';
import { HeaderLogo } from './components/HeaderLogo';
import { BugReportTable } from './components/BugReportTable';
import { FeatureRequestTable } from './components/FeatureRequestTable';
import { DetailPanel } from './components/DetailPanel';
import { TerminalPrompt } from './components/TerminalPrompt';
import { ReportMalfunctionModal } from './components/ReportMalfunctionModal';
import { SubmitIdeaModal } from './components/SubmitIdeaModal';
import { FullReportModal } from './components/FullReportModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminLoginModal } from './components/AdminLoginModal';

const ADMIN_PASSWORD = 'xleafiex';

export default function App() {
  // Persistent or stateful items (Fresh clean board)
  const [bugs, setBugs] = useState<BugReport[]>(() => {
    const saved = localStorage.getItem('bttfr_bugs_clean');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_BUG_REPORTS;
  });

  const [features, setFeatures] = useState<FeatureRequest[]>(() => {
    const saved = localStorage.getItem('bttfr_features_clean');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_FEATURE_REQUESTS;
  });

  // Current selections
  const [selectedBugId, setSelectedBugId] = useState<string>('');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');
  const [activePanel, setActivePanel] = useState<ActivePanel>('bugs');

  // Admin access state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('bttfr_is_admin') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminTargetItem, setAdminTargetItem] = useState<{
    item: BugReport | FeatureRequest;
    isBug: boolean;
  } | null>(null);

  // Modal open states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isFullReportOpen, setIsFullReportOpen] = useState(false);

  // Settings & Toggles (controllable ONLY via commands C:\BTTFR> CRT and SOUND)
  const [isCrtCurved, setIsCrtCurved] = useState(true);
  const [isTimeTraveling, setIsTimeTraveling] = useState(false);

  // Command prompt output log
  const [outputLog, setOutputLog] = useState<string[]>([]);

  // Active item
  const currentBug = bugs.find((b) => b.id === selectedBugId) || bugs[0] || ({} as BugReport);
  const currentFeature = features.find((f) => f.id === selectedFeatureId) || features[0] || ({} as FeatureRequest);
  const currentItem = activePanel === 'bugs' ? currentBug : currentFeature;
  const isBug = activePanel === 'bugs';

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('bttfr_bugs_clean', JSON.stringify(bugs));
  }, [bugs]);

  useEffect(() => {
    localStorage.setItem('bttfr_features_clean', JSON.stringify(features));
  }, [features]);

  useEffect(() => {
    localStorage.setItem('bttfr_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // Support / Vote action
  const handleVote = useCallback(() => {
    sound.playVote();
    if (activePanel === 'bugs') {
      if (!currentBug.id) return;
      setBugs((prev) =>
        prev.map((b) => {
          if (b.id === currentBug.id) {
            const nextHasVoted = !b.hasVoted;
            return {
              ...b,
              votes: nextHasVoted ? b.votes + 1 : Math.max(0, b.votes - 1),
              hasVoted: nextHasVoted,
            };
          }
          return b;
        })
      );
      setOutputLog((prev) => [
        ...prev,
        `> VOTE REGISTERED FOR BUG #${currentBug.id.toUpperCase()}: "${currentBug.title}". NEW TOTAL: ${
          currentBug.hasVoted ? currentBug.votes - 1 : currentBug.votes + 1
        }`,
      ]);
    } else {
      if (!currentFeature.id) return;
      setFeatures((prev) =>
        prev.map((f) => {
          if (f.id === currentFeature.id) {
            const nextHasVoted = !f.hasVoted;
            return {
              ...f,
              votes: nextHasVoted ? f.votes + 1 : Math.max(0, f.votes - 1),
              hasVoted: nextHasVoted,
            };
          }
          return f;
        })
      );
      setOutputLog((prev) => [
        ...prev,
        `> SUPPORT LOGGED FOR IDEA #${currentFeature.id.toUpperCase()}: "${currentFeature.title}". NEW TOTAL: ${
          currentFeature.hasVoted ? currentFeature.votes - 1 : currentFeature.votes + 1
        }`,
      ]);
    }
  }, [activePanel, currentBug, currentFeature]);

  // Admin status update handler
  const handleUpdateStatus = useCallback((id: string, newStatus: string, isBugItem: boolean) => {
    if (isBugItem) {
      setBugs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus as any } : b))
      );
    } else {
      setFeatures((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus as any } : f))
      );
    }
    setOutputLog((prev) => [
      ...prev,
      `> [ADMIN] TOPIC #${id.toUpperCase()} STATUS UPDATED TO: ${newStatus}`,
    ]);
  }, []);

  // Admin delete topic handler
  const handleDeleteTopic = useCallback((id: string, isBugItem: boolean) => {
    if (isBugItem) {
      setBugs((prev) => {
        const next = prev.filter((b) => b.id !== id);
        if (next.length > 0) setSelectedBugId(next[0].id);
        return next;
      });
    } else {
      setFeatures((prev) => {
        const next = prev.filter((f) => f.id !== id);
        if (next.length > 0) setSelectedFeatureId(next[0].id);
        return next;
      });
    }
    setOutputLog((prev) => [
      ...prev,
      `> [ADMIN] TOPIC #${id.toUpperCase()} PERMANENTLY PURGED FROM DATABASE.`,
    ]);
  }, []);

  // Open admin pen on a specific item
  const handleOpenAdminPen = useCallback((item: BugReport | FeatureRequest, isBugItem: boolean) => {
    setAdminTargetItem({ item, isBug: isBugItem });
    setIsAdminPanelOpen(true);
  }, []);

  // Admin authenticate handler
  const handleLogin = useCallback((pwd: string) => {
    if (pwd === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setOutputLog((prev) => [
        ...prev,
        '> [SECURITY] SUPERUSER LOGGED IN AS SYSTEM ADMINISTRATOR.',
        '> Pen edit controls [✎] are now enabled on each topic row.',
      ]);
      return true;
    }
    return false;
  }, []);

  // Command processor for C:\BTTFR>
  const handleCommand = useCallback(
    (rawCmd: string) => {
      const trimmed = rawCmd.trim();
      const parts = trimmed.split(/\s+/);
      const action = parts[0]?.toUpperCase() || '';
      const arg1 = parts[1] || '';
      const arg2 = parts.slice(2).join(' ') || '';

      switch (action) {
        case 'HELP':
          setOutputLog((prev) => [
            ...prev,
            `> COMMANDS:`,
            `  ADMIN <password>   : Superuser login (default: ${ADMIN_PASSWORD})`,
            `  STATUS <new_status>: (Admin) Set status of active topic`,
            `  DELETE / PURGE     : (Admin) Delete active topic`,
            `  ADMIN PANEL        : (Admin) Open GUI management console`,
            `  CRT                : Toggle CRT curvature mode (ON / FLAT)`,
            `  SOUND              : Toggle 80s synthesizer audio (ON / OFF)`,
            `  [F1] / REPORT      : File malfunction`,
            `  [F2] / IDEA        : Submit feature proposal`,
            `  VOTE / S           : Cast vote on active item`,
            `  VIEW / ENTER       : Open full dossier`,
            `  88MPH              : Engage temporal displacement`,
            `  DIR                : Directory listing`,
            `  DATE / TIME        : Temporal coordinates`,
            `  CLS / CLEAR        : Clear terminal buffer`,
          ]);
          break;

        case 'LOGIN':
        case 'ADMIN':
          if (!arg1) {
            if (isAdmin) {
              setAdminTargetItem({ item: currentItem, isBug });
              setIsAdminPanelOpen(true);
              setOutputLog((prev) => [...prev, '> OPENING ADMIN CONSOLE...']);
            } else {
              setIsAdminLoginModalOpen(true);
            }
          } else if (arg1 === ADMIN_PASSWORD) {
            setIsAdmin(true);
            sound.playSelect();
            setOutputLog((prev) => [
              ...prev,
              '> ACCESS GRANTED: SUPERUSER LOGGED IN AS SYSTEM ADMINISTRATOR.',
              '> Pen edit controls [✎] are now available on each topic.',
            ]);
            setAdminTargetItem({ item: currentItem, isBug });
            setIsAdminPanelOpen(true);
          } else {
            sound.playError();
            setOutputLog((prev) => [
              ...prev,
              '> ACCESS DENIED: INVALID SECURITY CREDENTIALS.',
            ]);
          }
          break;

        case 'LOGOUT':
          setIsAdmin(false);
          setOutputLog((prev) => [...prev, '> ADMIN LOGGED OUT.']);
          break;

        case 'STATUS': {
          if (!isAdmin) {
            sound.playError();
            setOutputLog((prev) => [
              ...prev,
              '> ACCESS DENIED: REQUIRES ADMIN LOGIN (TYPE: ADMIN xleafiex)',
            ]);
            break;
          }
          const targetStatus = (arg1 + (arg2 ? ' ' + arg2 : '')).toUpperCase();
          if (!targetStatus) {
            setOutputLog((prev) => [
              ...prev,
              `> USAGE: STATUS <NAME>`,
              `  BUGS: REPORTED | CONFIRMED | FIXING | FIXED`,
              `  FEATURES: SUGGESTED | CONSIDERING | WORKING ON | PLANNED`,
            ]);
            break;
          }
          handleUpdateStatus(currentItem.id, targetStatus, isBug);
          break;
        }

        case 'DELETE':
        case 'PURGE':
        case 'RM': {
          if (!isAdmin) {
            sound.playError();
            setOutputLog((prev) => [
              ...prev,
              '> ACCESS DENIED: REQUIRES ADMIN LOGIN (TYPE: ADMIN xleafiex)',
            ]);
            break;
          }
          handleDeleteTopic(currentItem.id, isBug);
          break;
        }

        case 'F1':
        case 'REPORT':
          setIsReportModalOpen(true);
          break;

        case 'F2':
        case 'IDEA':
          setIsIdeaModalOpen(true);
          break;

        case 'F3':
        case 'BUGS':
        case 'BUG':
          setActivePanel('bugs');
          setOutputLog((prev) => [...prev, '> SWITCHED TO BUG REPORTS.']);
          break;

        case 'F4':
        case 'FEATURES':
        case 'FEATURE':
          setActivePanel('features');
          setOutputLog((prev) => [...prev, '> SWITCHED TO FEATURE REQUESTS.']);
          break;

        case 'VOTE':
        case 'S':
        case 'SUPPORT':
          handleVote();
          break;

        case 'VIEW':
        case 'ENTER':
          setIsFullReportOpen(true);
          break;

        case '88MPH':
        case 'OUTATIME':
        case 'TIMETRAVEL':
          sound.play88Mph();
          setIsTimeTraveling(true);
          setOutputLog((prev) => [
            ...prev,
            '> [FLUX CAPACITOR OVERCHARGE] 1.21 GIGAWATTS DELIVERED!',
            '> TEMPORAL DISPLACEMENT ACTIVE. DESTINATION: OCT 26, 1985 01:20 AM',
          ]);
          setTimeout(() => {
            setIsTimeTraveling(false);
          }, 1200);
          break;

        case 'DIR':
          setOutputLog((prev) => [
            ...prev,
            ' Volume in drive C is HILL_VALLEY',
            ' Directory of C:\\BTTFR',
            '',
            'FEEDBACK EXE       128,492  10-23-85  10:04a',
            'ADMIN    SYS        16,384  10-23-85   8:30a',
            'COMMUN   DAT        64,512  10-21-85   9:00a',
            '       3 File(s)    209,388 bytes',
            '                  1,440,000 bytes free',
          ]);
          break;

        case 'DATE':
        case 'TIME':
          setOutputLog((prev) => [
            ...prev,
            '> CURRENT TEMPORAL COORDINATE: WEDNESDAY, OCT 23, 1985 10:04:00 AM PST',
          ]);
          break;

        case 'CRT':
          setIsCrtCurved((c) => {
            const next = !c;
            setOutputLog((log) => [
              ...log,
              `> CRT CURVATURE: ${next ? 'ENABLED' : 'DISABLED (FLAT)'}`,
            ]);
            return next;
          });
          break;

        case 'SOUND':
        case 'AUDIO': {
          const newState = sound.toggleSound();
          setOutputLog((prev) => [
            ...prev,
            `> 80S AUDIO SYNTHESIZER: ${newState ? 'ACTIVE' : 'MUTED'}`,
          ]);
          break;
        }

        case 'CLS':
        case 'CLEAR':
          setOutputLog([]);
          break;

        default:
          sound.playError();
          setOutputLog((prev) => [
            ...prev,
            `> Bad command or file name: "${rawCmd}". Type HELP for available commands.`,
          ]);
          break;
      }
    },
    [handleVote, isAdmin, currentItem, isBug, handleUpdateStatus, handleDeleteTopic]
  );

  // Global keyboard shortcuts (F1-F4, Enter, S, Esc, Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        if (e.key === 'Escape') {
          setIsReportModalOpen(false);
          setIsIdeaModalOpen(false);
          setIsFullReportOpen(false);
          setIsAdminLoginModalOpen(false);
          setIsAdminPanelOpen(false);
        }
        return;
      }

      switch (e.key) {
        case 'F1':
          e.preventDefault();
          sound.playSelect();
          setIsReportModalOpen(true);
          break;

        case 'F2':
          e.preventDefault();
          sound.playSelect();
          setIsIdeaModalOpen(true);
          break;

        case 'F3':
          e.preventDefault();
          sound.playSelect();
          setActivePanel('bugs');
          break;

        case 'F4':
          e.preventDefault();
          sound.playSelect();
          setActivePanel('features');
          break;

        case 'Enter':
          e.preventDefault();
          sound.playSelect();
          setIsFullReportOpen(true);
          break;

        case 's':
        case 'S':
          e.preventDefault();
          handleVote();
          break;

        case 'Escape':
          e.preventDefault();
          sound.playKeyClick();
          setIsReportModalOpen(false);
          setIsIdeaModalOpen(false);
          setIsFullReportOpen(false);
          setIsAdminLoginModalOpen(false);
          setIsAdminPanelOpen(false);
          break;

        case 'ArrowUp': {
          e.preventDefault();
          sound.playKeyClick();
          if (activePanel === 'bugs') {
            const idx = bugs.findIndex((b) => b.id === selectedBugId);
            if (idx > 0) setSelectedBugId(bugs[idx - 1].id);
          } else {
            const idx = features.findIndex((f) => f.id === selectedFeatureId);
            if (idx > 0) setSelectedFeatureId(features[idx - 1].id);
          }
          break;
        }

        case 'ArrowDown': {
          e.preventDefault();
          sound.playKeyClick();
          if (activePanel === 'bugs') {
            const idx = bugs.findIndex((b) => b.id === selectedBugId);
            if (idx < bugs.length - 1) setSelectedBugId(bugs[idx + 1].id);
          } else {
            const idx = features.findIndex((f) => f.id === selectedFeatureId);
            if (idx < features.length - 1) setSelectedFeatureId(features[idx + 1].id);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activePanel,
    bugs,
    features,
    selectedBugId,
    selectedFeatureId,
    handleVote,
  ]);

  return (
    <CrtMonitorFrame isCurved={isCrtCurved}>
      {/* 88 MPH Time Travel Flash Effect */}
      {isTimeTraveling && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-white animate-ping opacity-90" />
      )}

      {/* Header with Title, DeLorean vector, and [F1]/[F2] Buttons */}
      <HeaderLogo
        onF1={() => setIsReportModalOpen(true)}
        onF2={() => setIsIdeaModalOpen(true)}
        isAdmin={isAdmin}
        onLogout={() => {
          setIsAdmin(false);
          setOutputLog((prev) => [...prev, '> ADMIN LOGGED OUT.']);
        }}
      />

      {/* Main Dual Panels: BUG REPORTS on Left, FEATURE REQUESTS on Right */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-3 my-1">
        {/* Left: BUG REPORTS Table */}
        <BugReportTable
          bugs={bugs}
          selectedId={selectedBugId}
          onSelect={(bug) => {
            setSelectedBugId(bug.id);
            setActivePanel('bugs');
          }}
          isActiveList={activePanel === 'bugs'}
          isAdmin={isAdmin}
          onAdminEdit={(bug) => handleOpenAdminPen(bug, true)}
        />

        {/* Right: FEATURE REQUESTS Table */}
        <FeatureRequestTable
          features={features}
          selectedId={selectedFeatureId}
          onSelect={(feat) => {
            setSelectedFeatureId(feat.id);
            setActivePanel('features');
          }}
          isActiveList={activePanel === 'features'}
          isAdmin={isAdmin}
          onAdminEdit={(feat) => handleOpenAdminPen(feat, false)}
        />
      </main>

      {/* Bottom Detail Panel matching image: Detail Specs + Attached Screenshot (only if topic has photo) */}
      {currentItem.id && (
        <DetailPanel
          item={currentItem}
          isBug={isBug}
          onEnterFullReport={() => setIsFullReportOpen(true)}
          onVote={handleVote}
          onBackToList={() => {
            setActivePanel(isBug ? 'bugs' : 'features');
          }}
        />
      )}

      {/* Bottom Interactive Command Line: C:\BTTFR> █ */}
      <TerminalPrompt
        onCommand={handleCommand}
        outputLog={outputLog}
        onClearLog={() => setOutputLog([])}
      />

      {/* Modals */}
      <ReportMalfunctionModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={(newBug) => {
          setBugs((prev) => [newBug, ...prev]);
          setSelectedBugId(newBug.id);
          setActivePanel('bugs');
          setOutputLog((prev) => [
            ...prev,
            `> NEW BUG REPORT TRANSMITTED: "${newBug.title}" (TOTAL BUGS: ${bugs.length + 1})`,
          ]);
        }}
      />

      <SubmitIdeaModal
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
        onSubmit={(newFeat) => {
          setFeatures((prev) => [newFeat, ...prev]);
          setSelectedFeatureId(newFeat.id);
          setActivePanel('features');
          setOutputLog((prev) => [
            ...prev,
            `> NEW FEATURE PROPOSAL LOGGED: "${newFeat.title}" (TOTAL IDEAS: ${features.length + 1})`,
          ]);
        }}
      />

      {currentItem.id && (
        <FullReportModal
          isOpen={isFullReportOpen}
          onClose={() => setIsFullReportOpen(false)}
          item={currentItem}
          isBug={isBug}
          onVote={handleVote}
        />
      )}

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Admin Topic Status & Purge Panel */}
      {isAdmin && adminTargetItem && (
        <AdminPanelModal
          isOpen={isAdminPanelOpen}
          onClose={() => {
            setIsAdminPanelOpen(false);
            setAdminTargetItem(null);
          }}
          activeItem={adminTargetItem.item}
          isBug={adminTargetItem.isBug}
          onUpdateStatus={handleUpdateStatus}
          onDeleteTopic={handleDeleteTopic}
          onLogout={() => {
            setIsAdmin(false);
            setOutputLog((prev) => [...prev, '> ADMIN LOGGED OUT.']);
          }}
        />
      )}
    </CrtMonitorFrame>
  );
}
