// Module 4: Final Quiz & Assessment data for Linux Basics Interactive Digital Book
export const finalQuizQuestions = [
  {
    id: "fq-1",
    question: "Which component of Linux acts as the mediator between system software and physical hardware?",
    options: ["GNU Tools", "The Kernel", "Bash Shell", "X11 Desktop Manager"],
    answer: 1,
    explanation: "The kernel directly interfaces with the CPU, physical RAM, and disk drivers, translating programmatic system calls into hardware instructions."
  },
  {
    id: "fq-2",
    question: "What does the 'uname -r' command return?",
    options: ["Logged-in user counts", "IP routing addresses", "Active Kernel release version", "Uptime durations"],
    answer: 2,
    explanation: "'uname -r' specifically outputs the release version string of the active Linux kernel."
  },
  {
    id: "fq-3",
    question: "Which memory region partition runs under Ring 3 privilege of hardware sandboxing?",
    options: ["Kernel Space", "User Space", "BIOS Memory", "Swap Partition"],
    answer: 1,
    explanation: "Applications and shells execute in User Space, which is throttled to Ring 3 CPU privilege to prevent fatal system crashes."
  },
  {
    id: "fq-4",
    question: "Where are system-wide text configuration settings kept under the Filesystem Hierarchy Standard (FHS)?",
    options: ["/bin", "/var", "/etc", "/opt"],
    answer: 2,
    explanation: "The '/etc' directory is reserved exclusively for storing system-wide text configurations and service variables."
  },
  {
    id: "fq-5",
    question: "What is the difference between '/root' and '/'?",
    options: ["They are synonymous", "'/' is the absolute base of the file hierarchy, while '/root' is the administrator's home folder", "'/root' contains libraries", "'/' is volatile memory"],
    answer: 1,
    explanation: "'/' is the root of the entire filesystem. '/root' is the private home folder of the root administrative user."
  },
  {
    id: "fq-6",
    question: "What is the primary function of the special directory indicator '..' in terminal shells?",
    options: ["Clear terminal lists", "Refer to the active current directory", "Represent the parent directory of the current folder", "Open home directory"],
    answer: 2,
    explanation: "'..' is a hard-coded relative shortcut navigating to the immediate parent of your active directory."
  },
  {
    id: "fq-7",
    question: "Which CLI command removes a non-empty directory 'cyber_logs' recursively and forcefully?",
    options: ["rmdir cyber_logs", "rm -rf cyber_logs", "rm cyber_logs", "delete -dir cyber_logs"],
    answer: 1,
    explanation: "Deleting non-empty directories requires the recursive ('-r') and force ('-f') options."
  },
  {
    id: "fq-8",
    question: "What octal value represents a file permission profile of 'rwxr-xr-x'?",
    options: ["644", "755", "700", "777"],
    answer: 1,
    explanation: "rwx = 4+2+1=7 (user); r-x = 4+1=5 (group); r-x = 4+1=5 (others). Combined, they yield 755."
  },
  {
    id: "fq-9",
    question: "Which command alters file owner and group attributes in Linux?",
    options: ["chmod", "chown", "chgrp", "usermod"],
    answer: 1,
    explanation: "'chown' modifies both user and group file ownership mappings."
  },
  {
    id: "fq-10",
    question: "What signal does 'kill -9 <PID>' send, and how does the kernel handle it?",
    options: ["SIGTERM; process shuts down gracefully", "SIGKILL; kernel immediately terminates the process without bypass or catch", "SIGSTOP; process is paused", "SIGINT; keyboard interrupt"],
    answer: 1,
    explanation: "Signal 9 is SIGKILL, which is executed directly by the kernel to terminate a process immediately."
  },
  {
    id: "fq-11",
    question: "What command shows real-time, interactive CPU, memory, and task performance metrics?",
    options: ["ps aux", "free", "df", "top"],
    answer: 3,
    explanation: "'top' provides a real-time, dynamic console showing active system statistics and thread loads."
  },
  {
    id: "fq-12",
    question: "Which tool downloads web files directly over HTTP/HTTPS in the CLI?",
    options: ["curl -I", "wget", "netstat", "ip address"],
    answer: 1,
    explanation: "'wget' is a CLI downloader designed to pull down pages, files, and assets."
  },
  {
    id: "fq-13",
    question: "What does the command 'grep -i \"error\" syslog' achieve?",
    options: ["Counts error lines", "Lists errors recursively", "Performs a case-insensitive search for 'error' in syslog", "Deletes errors"],
    answer: 2,
    explanation: "The '-i' flag disables case-sensitivity, matching 'Error', 'ERROR', or 'error'."
  },
  {
    id: "fq-14",
    question: "Which file contains salted cryptographic password hashes of user accounts, readable only by root?",
    options: ["/etc/passwd", "/etc/shadow", "/var/log/auth.log", "/etc/sudoers"],
    answer: 1,
    explanation: "'/etc/shadow' is highly protected (600 permissions), housing administrative password hashes."
  },
  {
    id: "fq-15",
    question: "What safe configuration tool should be used to edit user sudo permissions in '/etc/sudoers'?",
    options: ["nano", "vim", "visudo", "sudoedit"],
    answer: 2,
    explanation: "'visudo' performs immediate syntax checking before saving, preventing configurations that block administrative sudo commands."
  }
];

export const finalAssessmentScenarios = [
  {
    id: "scenario-1",
    title: "Scenario 1: Securing Private Keys",
    description: "An administrative operator generates a SSH private key (id_rsa) to connect to secondary backups. They run 'ls -l id_rsa' and find permissions are set to -rw-r--r-- (644), making it world-readable. Any local guest user can steal this file to gain access. What is the correct remediation command?",
    options: [
      "chmod 777 id_rsa",
      "chmod 600 id_rsa",
      "chown root:root id_rsa",
      "chmod u+x id_rsa"
    ],
    answer: 1,
    correctText: "chmod 600 id_rsa",
    explanation: "Remediating a world-readable private key requires restricting access exclusively to the owner. 'chmod 600' gives Read/Write to the user, and blocks all access from Group and Others."
  },
  {
    id: "scenario-2",
    title: "Scenario 2: Investigating a Rogue Process",
    description: "A secure monitoring agent reports that an active web server is running at 100% CPU capacity. You need to identify if a malicious process has been injected. After running 'top', you discover a suspicious script running under PID 9140 that resists standard 'kill' commands. What is your immediate incident response escalation command?",
    options: [
      "kill -15 9140",
      "kill -9 9140",
      "rm -rf /proc/9140",
      "sudo systemctl stop init"
    ],
    answer: 1,
    correctText: "kill -9 9140",
    explanation: "If a rogue or corrupted process ignores standard terminate signals (SIGTERM 15), you must force immediate termination using SIGKILL (signal 9) directly handled by the kernel."
  },
  {
    id: "scenario-3",
    title: "Scenario 3: Auditing SSH Hardening",
    description: "During a routine compliance check of your company's web hosting environment, you inspect the remote connection rules inside '/etc/ssh/sshd_config'. You notice that 'PermitRootLogin yes' and 'PasswordAuthentication yes' are both enabled. These settings allow external actors to brute-force your master administrative credentials. What is the correct hardening response?",
    options: [
      "Set PermitRootLogin no and PasswordAuthentication no, then restart the sshd service",
      "Delete the /etc/ssh/sshd_config file completely",
      "Enable UFW and block port 22 completely, preventing all SSH connections",
      "Run chmod 000 /etc/ssh/sshd_config"
    ],
    answer: 0,
    correctText: "Set PermitRootLogin no and PasswordAuthentication no, then restart the sshd service",
    explanation: "Hardening SSH requires blocking direct root login over networks ('PermitRootLogin no') and disabling brute-forceable password authentication in favor of asymmetric cryptographic keys ('PasswordAuthentication no')."
  }
];
