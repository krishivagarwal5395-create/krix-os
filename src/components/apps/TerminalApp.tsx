import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  text: string;
}

export const TerminalApp: React.FC = () => {
  const { files, settings } = useDesktop();
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: '1', type: 'output', text: 'KRIX Terminal v2.4.0 — macOS Darwin / Windows 11 Subsystem' },
    { id: '2', type: 'output', text: 'Target Device: Lenovo ThinkPad X1 Carbon Gen 11 (Intel Core i7-1365U)' },
    { id: '3', type: 'output', text: 'Type "help" for a list of available commands or "neofetch" for system telemetry.\n' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const newHistory: TerminalLine[] = [
      ...history,
      { id: `in-${Date.now()}`, type: 'input', text: `thinkpad@krix-os:~$ ${cmd}` },
    ];

    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `Available KRIX Shell Commands:
  neofetch / winfetch : Display ThinkPad hardware & Windows 11 system specs
  ls                  : List files and directories
  pwd                 : Print working directory
  date                : Display system date and time
  uname -a            : Operating system kernel information
  ps / top            : List active desktop processes
  clear               : Clear terminal window
  whoami              : Print active user session
  echo [text]         : Echo text back to terminal
  ping [host]         : Simulated ICMP ping
  help                : Show this help guide`,
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'neofetch':
      case 'winfetch':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `       .---.            thinkpad@krix-os
      /     \\           ----------------
     | () () |          OS: Windows 11 Pro 64-bit (23H2)
      \\  ^  /           Host: Lenovo ThinkPad X1 Carbon Gen 11
       |||||            Kernel: KRIX Hybrid Compositor v2.4
       |||||            Uptime: 4 hours, 18 mins
                        Shell: krix-sh 2.4.0
                        Resolution: 2880x1800 90Hz OLED
                        DE: KRIX Desktop (macOS Sonoma Inspired)
                        CPU: 13th Gen Intel Core i7-1365U (10) @ 5.2GHz
                        GPU: Intel Iris Xe Graphics
                        Memory: 11420MiB / 32768MiB (34%)
                        TrackPoint: UltraNav Red Active
                        Battery: 88% [RapidCharge Active]`,
        });
        break;

      case 'ls':
        const fileNames = files.map((f) => f.name).join('   ');
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: fileNames || 'Documents   Projects   Pictures   Downloads',
        });
        break;

      case 'pwd':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: '/c/Users/ThinkPad/Desktop',
        });
        break;

      case 'whoami':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'thinkpad-user (Admin / Krishiv)',
        });
        break;

      case 'date':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: new Date().toString(),
        });
        break;

      case 'uname':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'KRIX-Darwin 23.4.0 ThinkPad-Win11 x86_64 Intel Core i7',
        });
        break;

      case 'ps':
      case 'top':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `PID   COMMAND             %CPU   %MEM
101   krix-window-server   3.4    4.2
142   krix-notes           0.8    1.6
205   thinkpad-ultranav    0.2    0.4
318   intel-iris-driver    1.1    2.8
455   gemini-ai-agent      0.4    1.2`,
        });
        break;

      case 'echo':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: args.join(' '),
        });
        break;

      case 'ping':
        newHistory.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `PING ${args[0] || 'localhost'} (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.082 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.075 ms
--- ${args[0] || 'localhost'} ping statistics ---
2 packets transmitted, 2 packets received, 0.0% packet loss`,
        });
        break;

      default:
        newHistory.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `krix-sh: command not found: ${command}. Type "help" for a list of available commands.`,
        });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0d1117] text-[#c9d1d9] font-mono text-xs p-4 select-text overflow-hidden">
      {/* Scrollable terminal buffer */}
      <div className="flex-1 overflow-y-auto space-y-1.5 whitespace-pre-wrap leading-relaxed">
        {history.map((line) => (
          <div
            key={line.id}
            className={
              line.type === 'input'
                ? 'text-emerald-400 font-semibold'
                : line.type === 'error'
                ? 'text-rose-400'
                : 'text-slate-300'
            }
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal prompt input */}
      <form onSubmit={handleCommand} className="mt-2 flex items-center gap-2 pt-2 border-t border-white/10">
        <span className="text-red-500 font-bold shrink-0">thinkpad@krix-os:~$</span>
        <input
          type="text"
          autoFocus
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs caret-red-500"
          placeholder="type command..."
        />
      </form>
    </div>
  );
};
