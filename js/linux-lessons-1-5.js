// Module 1: Lessons 1 to 5 of Linux Basics Interactive Digital Book
export const lessons1to5 = [
  {
    id: "linux-lesson-1",
    title: "Lesson 1: Introduction to Linux",
    category: "Operating Systems",
    duration: "45 mins",
    objectives: [
      "Understand the open-source philosophy of Linux.",
      "Identify the core components: Kernel, Shell, and Filesystem.",
      "Recognize why Linux is preferred in cyber security operations."
    ],
    introduction: "Linux is a free, open-source, Unix-like operating system that powers the vast majority of server infrastructures, cloud platforms, supercomputers, and embedded devices across the globe.",
    explanation: "At its heart, Linux represents a philosophy of sharing and collaboration. Unlike proprietary operating systems (like Windows or macOS), any developer can inspect, modify, and distribute the Linux kernel source code. Linux is built to be modular, secure, and multi-user, separating core system drivers from user interfaces.",
    stepByStep: [
      "Step 1: The Linux Kernel manages physical hardware resources (CPU, RAM, Disks).",
      "Step 2: The Shell acts as a command interpreter translating your text into kernel instructions.",
      "Step 3: User Space contains utility software, system daemons, and graphical user interfaces.",
      "Step 4: Everything in Linux is represented as a file, providing a unified access interface.",
      "Step 5: The Command Line Interface (CLI) is the primary environment for administrative and security tools."
    ],
    realWorldExample: "Over 96% of the top 1 million web servers run on Linux due to its stability, resource efficiency, and robust security architecture.",
    commands: [
      { cmd: "uname -a", desc: "Display complete kernel release, version, and architecture information." },
      { cmd: "cat /etc/os-release", desc: "Show detailed information about the active Linux distribution." }
    ],
    diagram: `┌────────────────────────────────────────────────────────┐
│                   User Applications                    │
├────────────────────────────────────────────────────────┤
│        System Utilities / Shell (Bash, Zsh)            │
├────────────────────────────────────────────────────────┤
│                      Linux Kernel                      │
├────────────────────────────────────────────────────────┤
│                    Physical Hardware                   │
└────────────────────────────────────────────────────────┘`,
    notes: [
      "Linux is strictly case-sensitive. File1.txt and file1.txt are entirely distinct.",
      "Most Linux configurations are stored in text files, making configuration highly scriptable."
    ],
    bestPractices: [
      "Never log in as root unless absolutely necessary; use 'sudo' for administrative tasks.",
      "Use strong, unique credentials for system accounts."
    ],
    commonMistakes: [
      "Using backslashes (\\) instead of forward slashes (/) for directory paths.",
      "Typing commands in uppercase (e.g., LS instead of ls)."
    ],
    quickTips: [
      "Double-tap the Tab key to autocomplete filenames and system commands.",
      "Use 'clear' or Ctrl+L to quickly clear your terminal screen."
    ],
    keyTerms: {
      "Kernel": "The core software component that directly manages hardware interfaces and memory.",
      "Distribution (Distro)": "A complete operating system bundle containing the Linux kernel and selected software packages.",
      "Open Source": "Software where the source code is freely available for inspection and modification.",
      "Sudo": "SuperUser Do - a utility that grants temporary administrative credentials.",
      "Root": "The master administrator account with absolute control over the entire system."
    },
    summary: "Linux is a highly stable, open-source operating system that provides a unified, file-based interface for managing hardware and administrative tasks.",
    faq: [
      { q: "Is Linux completely free?", a: "Yes, most mainstream distributions (like Ubuntu, Debian, and Fedora) are entirely free for personal and commercial use." },
      { q: "What is a distribution?", a: "It is the Linux kernel bundled with utilities and a package manager (e.g., Red Hat, Debian)." }
    ],
    quiz: [
      { question: "Who created the initial version of the Linux kernel in 1991?", options: ["Richard Stallman", "Linus Torvalds", "Steve Jobs", "Ken Thompson"], answer: 1, explanation: "Linus Torvalds created the Linux kernel in 1991 as an undergraduate project." },
      { question: "Which component of Linux interacts directly with physical hardware?", options: ["Shell", "Desktop Environment", "Kernel", "Package Manager"], answer: 2, explanation: "The kernel sits between hardware and the system software to manage physical resources." },
      { question: "What does the 'uname -a' command display?", options: ["User details", "Network status", "Kernel and system details", "Installed software"], answer: 2, explanation: "'uname -a' prints the operating system name, kernel release version, architecture, and date." },
      { question: "Linux is open-source. What does this mean?", options: ["Anyone can read and modify the source code", "It has no built-in security", "It only runs on open networks", "It is illegal to use for business"], answer: 0, explanation: "Open-source means the underlying code is fully accessible to anyone to inspect, modify, and distribute." },
      { question: "What is the name of the absolute administrator account in Linux?", options: ["Admin", "SuperUser", "Administrator", "Root"], answer: 3, explanation: "The 'root' account has absolute permissions over all files and commands on a Linux system." },
      { question: "Which command reveals the active Linux distribution name and version?", options: ["uname -r", "cat /etc/os-release", "ls -l", "hostnamectl"], answer: 1, explanation: "Reading '/etc/os-release' displays the standard metadata of the Linux distribution." },
      { question: "Is Linux case-sensitive?", options: ["Only for folders", "Yes, completely", "No, never", "Only in shell scripts"], answer: 1, explanation: "Linux is completely case-sensitive for commands, filenames, directories, and variables." },
      { question: "What is 'sudo' used for?", options: ["To shutdown the system", "To execute commands as another user, typically root", "To compile software", "To switch desktops"], answer: 1, explanation: "'sudo' lets verified users run commands with root privileges temporarily." },
      { question: "Which of the following is NOT a Linux distribution?", options: ["Ubuntu", "Red Hat Enterprise Linux", "Windows Defender", "Debian"], answer: 2, explanation: "Windows Defender is an antivirus program for Windows, not a Linux distribution." },
      { question: "What is the default command interpreter in most Linux distributions?", options: ["CMD", "Bash", "PowerShell", "CommandPrompt"], answer: 1, explanation: "Bash (Bourne Again Shell) is the industry-standard default command interpreter on most Linux platforms." }
    ],
    practicalExercises: [
      "Open your terminal and type 'uname -a' to identify your kernel build.",
      "Execute 'cat /etc/os-release' and locate your distribution name.",
      "Try running 'whoami' to view your active user context.",
      "Check the host name of your system by executing 'hostname'.",
      "Run 'clear' to reset your command-line workspace."
    ],
    interviewQuestions: [
      { q: "What is the difference between Linux and GNU?", a: "Linux is strictly the kernel. GNU is a collection of essential tools (compilers, libraries, command utilities) which are bundled with the kernel to make a complete OS." },
      { q: "What is a CLI, and why is it preferred over a GUI in server administration?", a: "The Command Line Interface is text-only. It is preferred because it consumes minimal resources, supports powerful shell scripting, can be accessed remotely over low-bandwidth SSH, and offers absolute granularity over operations." },
      { q: "Explain the concept 'Everything is a file' in Linux.", a: "Linux treats all physical hardware devices (like USBs, hard drives, networks) and processes as directories of characters or bytes in the virtual file system, allowing standardized reading and writing utilities." },
      { q: "What is a Linux distribution?", a: "A distribution is a complete bundle of the Linux kernel, core GNU tools, shell environments, graphical interfaces, and a package manager maintained by an organization or community." },
      { q: "Why is 'sudo' preferred over logging in directly as 'root'?", a: "Logging in as root creates high vulnerability to accidental file deletions or malware. 'sudo' logs administrative command usage, requires re-authentication, and restricts access to certified operators only." }
    ]
  },
  {
    id: "linux-lesson-2",
    title: "Lesson 2: Linux Architecture & the Kernel",
    category: "Operating Systems",
    duration: "50 mins",
    objectives: [
      "Differentiate between Kernel Space and User Space.",
      "Understand the mechanics of System Calls.",
      "Recognize the role of Device Drivers and Modules."
    ],
    introduction: "To build secure systems, we must understand the core architectural boundary of Linux: the strict isolation between high-privilege kernel operations and low-privilege user apps.",
    explanation: "Linux divides memory into two primary execution spaces: Kernel Space and User Space. Kernel Space is a highly privileged memory zone where the kernel runs and has unrestricted access to hardware. User Space is a sandboxed zone where user applications (like web browsers or terminal shells) run. When an application needs to access hardware or read a file, it must request help from the kernel using a secure interface known as a 'System Call' (syscall).",
    stepByStep: [
      "Step 1: Applications run in User Space (Ring 3 of hardware CPU privileges).",
      "Step 2: To access files or network ports, the application calls a standard library API (like glibc).",
      "Step 3: The API triggers a software interrupt, loading a transition into Kernel Space (Ring 0).",
      "Step 4: The Kernel validates permissions and executes the requested driver instructions.",
      "Step 5: The Kernel returns the result and shifts execution control back to User Space."
    ],
    realWorldExample: "Malicious software in Linux cannot access hard disk data directly because the kernel intercepts every memory access attempt, isolating crashes and preventing system-wide lockouts.",
    commands: [
      { cmd: "lsmod", desc: "List currently loaded kernel modules (device drivers)." },
      { cmd: "dmesg | head -n 20", desc: "View the kernel ring buffer logs to audit system boot drivers." }
    ],
    diagram: `┌────────────────────────────────────────────────────────┐
│ USER SPACE (Ring 3) - Web Server, Shell, Browser       │
├────────────────────────────────────────────────────────┤
│                     SYSTEM CALLS                       │
├────────────────────────────────────────────────────────┤
│ KERNEL SPACE (Ring 0) - CPU Scheduler, Drivers, Memory │
└────────────────────────────────────────────────────────┘`,
    notes: [
      "Kernel Space crashes (such as division by zero in drivers) result in a 'Kernel Panic', halting the machine.",
      "LKM (Loadable Kernel Modules) let the kernel add drivers on-the-fly without a reboot."
    ],
    bestPractices: [
      "Keep your kernel updated to fix security vulnerabilities in system call interfaces.",
      "Avoid loading unverified kernel modules as they can bypass all security controls."
    ],
    commonMistakes: [
      "Thinking that running a user-space application with sudo allows it to bypass system calls.",
      "Assuming all hardware requires manual drivers in Linux. Most are built directly into the kernel."
    ],
    quickTips: [
      "Use 'modinfo <module_name>' to view the description of any loaded system driver.",
      "Use 'sysctl' to fine-tune active kernel parameters at runtime."
    ],
    keyTerms: {
      "Kernel Space": "High-privilege memory region reserved strictly for running the core operating system.",
      "User Space": "Low-privilege memory partition where standard applications run under CPU sandboxing.",
      "System Call": "The secure API pathway used by programs to request system resources from the kernel.",
      "Kernel Panic": "A safety halt triggered by the kernel upon encountering an unrecoverable low-level system error.",
      "LKM": "Loadable Kernel Module - dynamic extensions that let you plug in hardware drivers on-the-fly."
    },
    summary: "Linux isolates system execution into low-privilege User Space and high-privilege Kernel Space, mediating all hardware requests via System Calls.",
    faq: [
      { q: "What is a system call?", a: "It is an entry point through which an application securely requests the kernel to execute restricted operations on its behalf." },
      { q: "What is a kernel module?", a: "A segment of binary code that can be loaded into the running kernel dynamically to support new devices or file systems." }
    ],
    quiz: [
      { question: "What memory space do standard applications run in?", options: ["Kernel Space", "Root Space", "User Space", "Physical Space"], answer: 2, explanation: "All user-facing applications run inside low-privilege User Space to prevent direct system crashes." },
      { question: "What is the interface that programs use to request resources from the kernel?", options: ["System Calls", "Network Ports", "Standard Libraries", "Desktop Environment"], answer: 0, explanation: "System Calls are the API interface bridging User Space and Kernel Space." },
      { question: "Which CPU Privilege Ring does Kernel Space run in?", options: ["Ring 3", "Ring 0", "Ring 1", "Ring 2"], answer: 1, explanation: "Ring 0 is the most privileged execution layer of hardware, dedicated to the kernel." },
      { question: "What happens when the kernel encounters a fatal, unrecoverable internal error?", options: ["Blue Screen of Death", "System Call Reject", "Kernel Panic", "Application Exit"], answer: 2, explanation: "A 'Kernel Panic' is triggered, halting execution to prevent system corruption." },
      { question: "Which command lists currently active, dynamically loaded device drivers?", options: ["lsmod", "uname", "dmesg", "top"], answer: 0, explanation: "'lsmod' prints all currently active Loadable Kernel Modules." },
      { question: "Why is memory split into User and Kernel spaces?", options: ["To speed up the internet", "To separate user files from system files", "For stability and security, protecting hardware from crashes", "To store more pictures"], answer: 2, explanation: "Isolation ensures an application crash cannot directly destroy the operating system or hardware." },
      { question: "Which utility is used to query or modify kernel parameters at runtime?", options: ["lsmod", "sysctl", "dmesg", "sudo"], answer: 1, explanation: "'sysctl' is the administrative command used to configure active kernel settings." },
      { question: "Where are kernel ring buffer messages logged during boot?", options: ["/var/log/boot", "dmesg", "syslog", "journalctl"], answer: 1, explanation: "The 'dmesg' command directly reads the volatile kernel ring buffer containing hardware detection logs." },
      { question: "What does 'LKM' stand for?", options: ["Lightweight Kernel Model", "Loadable Kernel Module", "Linux Key Manager", "Local Kernel Monitor"], answer: 1, explanation: "LKM stands for Loadable Kernel Module, facilitating plug-and-play drivers." },
      { question: "What standard library provides the system call wrappers for Linux applications?", options: ["glibc", "DirectX", "Win32", "OpenSSL"], answer: 0, explanation: "The GNU C Library (glibc) provides the standard system call wrappers on Linux." }
    ],
    practicalExercises: [
      "Run 'lsmod' and view the list of loaded module drivers.",
      "Execute 'dmesg | grep -i error' to scan your kernel boot messages for active device issues.",
      "Check module info for a driver (e.g., 'modinfo ext4' or 'modinfo usbcore') if available.",
      "Run 'sysctl -a | head -n 30' to view active operational kernel configurations.",
      "View the path '/proc/sys/kernel' to inspect kernel variables via the filesystem."
    ],
    interviewQuestions: [
      { q: "What is the difference between a Monolithic and a Microkernel architecture, and which does Linux use?", a: "Linux is a hybrid-monolithic kernel. This means all major OS services (drivers, filesystem, process scheduler) run in a single, high-privileged kernel address space for high speed, but it supports dynamic modules (LKMs) to extend capabilities on the fly, unlike pure microkernels which push services into user space." },
      { q: "What is a 'System Call', and what happens on the hardware level during one?", a: "A system call is the programmatic interface of the kernel. During a syscall, the CPU switches privilege context from Ring 3 (User) to Ring 0 (Kernel) via software interrupts or hardware instructions ('syscall'/'sysenter'), allowing the kernel to run the privileged operation, then context-switches back." },
      { q: "What is a Kernel Panic?", a: "A Kernel Panic is an action taken by an operating system upon detecting an internal fatal error from which it cannot safely recover (e.g., corrupt memory or missing system files). It halts the CPU to prevent file system corruption." },
      { q: "Why can't user-space programs access memory in kernel-space directly?", a: "The CPU's Memory Management Unit (MMU) enforces page table permissions. Kernel memory pages are flagged for supervisor privilege level (Ring 0). Any unauthorized user-space read/write attempt triggers a hardware-level segmentation fault." },
      { q: "What are Loadable Kernel Modules (LKMs), and what security risks do they carry?", a: "LKMs are dynamic binary modules that can run in kernel space without rebooting. From a security standpoint, if an attacker loads a malicious module (like a kernel rootkit), they gain absolute, invisible control of the system, bypassing all standard security checks." }
    ]
  },
  {
    id: "linux-lesson-3",
    title: "Lesson 3: The File System Hierarchy",
    category: "Operating Systems",
    duration: "45 mins",
    objectives: [
      "Navigate the Linux Filesystem Hierarchy Standard (FHS).",
      "Understand where configurations, binaries, and logs are stored.",
      "Distinguish between Absolute and Relative Paths."
    ],
    introduction: "Unlike Windows, which uses drive letters (C:, D:), Linux structures everything into a single unified directory tree starting from the root directory represented by a single forward slash (/).",
    explanation: "The Linux directory structure is strictly standardized by the Filesystem Hierarchy Standard (FHS). In this hierarchy, specific folders have dedicated, unyielding roles. Administrative system binaries live in '/sbin' and '/bin', configuration parameters reside in '/etc', user files are kept in '/home', active system logs are written to '/var/log', and virtual system hardware links map to '/dev'.",
    stepByStep: [
      "Step 1: The root directory '/' represents the absolute base of the entire system.",
      "Step 2: '/etc' is the central repository for all system-wide text configuration files.",
      "Step 3: '/bin' and '/sbin' store basic user executable commands and admin commands respectively.",
      "Step 4: '/home' contains the isolated personal storage folders for non-root users.",
      "Step 5: '/var' handles variable data, including databases, mail queues, and syslog logs."
    ],
    realWorldExample: "Web servers look in '/var/www' for web files, write operational logs to '/var/log/apache2', and load their hosting settings from '/etc/apache2/apache2.conf'.",
    commands: [
      { cmd: "ls /", desc: "List all folders located at the root of the file system hierarchy." },
      { cmd: "ls /etc", desc: "List configuration files inside the system-wide etc folder." }
    ],
    diagram: `                      / (Root Directory)
     ┌────────┬────────┴───────┬─────────┬────────┐
   /bin     /etc             /home     /var     /dev
 (Binaries) (Config Files) (Users)   (Logs)   (Hardware)`,
    notes: [
      "Paths starting with '/' are Absolute Paths. Paths starting with folder names are Relative to your current working directory.",
      "The directory '/proc' is a virtual filesystem containing active process memory and kernel statistics, occupying 0 bytes on the physical disk."
    ],
    bestPractices: [
      "Never install third-party programs directly in '/bin'. Use '/usr/local/bin' or '/opt' instead.",
      "Regularly audit write access permissions to '/etc' to prevent unprivileged config edits."
    ],
    commonMistakes: [
      "Deleting files in '/tmp' and expecting storage to be freed permanently (it is volatile).",
      "Confusing '/root' (the superuser's personal home directory) with '/' (the root of the hierarchy)."
    ],
    quickTips: [
      "Use '~' as a shortcut to represent your home directory.",
      "Use '..' to refer to the parent directory, and '.' to refer to your current folder."
    ],
    keyTerms: {
      "FHS": "Filesystem Hierarchy Standard - the official blueprint governing directory roles in Linux.",
      "Absolute Path": "A directory reference specifying the complete path starting from the root ('/').",
      "Relative Path": "A directory path relative to the active folder location of the terminal.",
      "/etc": "The central repository for configuration settings, always stored as clean text files.",
      "/var": "A directory reserved for variable data files like logs, databases, and system mail."
    },
    summary: "Linux employs a unified hierarchical tree structure (FHS) starting from '/' that represents all configuration, system commands, user files, and devices.",
    faq: [
      { q: "Where do my personal documents go?", a: "They are kept under '/home/your_username/'." },
      { q: "What is inside /dev?", a: "Device files that represent hard drives, USB ports, sound cards, and virtual streams (like /dev/null)." }
    ],
    quiz: [
      { question: "Which directory contains system-wide configuration files in Linux?", options: ["/bin", "/etc", "/var", "/home"], answer: 1, explanation: "The '/etc' directory stores text configurations for system services and apps." },
      { question: "What does the root directory symbol look like in Linux?", options: ["C:\\", "~", "/", ".."], answer: 2, explanation: "A single forward slash ('/') represents the absolute base root directory of the Linux filesystem." },
      { question: "Where are runtime application log files primarily stored?", options: ["/home", "/etc", "/var/log", "/tmp"], answer: 2, explanation: "Logs are variable data, written inside '/var/log/'." },
      { question: "Which directory is volatile and cleared automatically upon system reboot?", options: ["/opt", "/tmp", "/var", "/bin"], answer: 1, explanation: "The '/tmp' directory stores temporary, volatile data cleared during startup." },
      { question: "What is stored inside the '/sbin' directory?", options: ["User media", "System administrator binaries", "Source code files", "Secondary packages"], answer: 1, explanation: "'/sbin' contains system binaries for system maintenance and administrator operations." },
      { question: "Which directory holds personal directories for standard non-root users?", options: ["/root", "/home", "/usr", "/etc"], answer: 1, explanation: "'/home' contains personal subdirectories for system users." },
      { question: "What is the difference between '/root' and '/'?", options: ["They are the same", "'/root' is the administrator's home folder; '/' is the base directory of the filesystem", "'/' is for standard users; '/root' is for hardware", "They are virtual files"], answer: 1, explanation: "'/' is the absolute tree root; '/root' is the personal home directory of the root admin." },
      { question: "What type of path is 'Documents/reports.txt'?", options: ["Absolute Path", "Relative Path", "Virtual Path", "System Path"], answer: 1, explanation: "Since it does not start with a '/', it is relative to the active terminal workspace." },
      { question: "What does the special directory double dot '..' represent?", options: ["Current folder", "System Root", "Parent directory of the current folder", "Home directory"], answer: 2, explanation: "'..' navigates to the immediate parent of the active directory." },
      { question: "Which virtual directory contains real-time information about system memory and processes?", options: ["/proc", "/dev", "/usr", "/sys"], answer: 0, explanation: "The '/proc' directory exposes real-time kernel memory data as a virtual file hierarchy." }
    ],
    practicalExercises: [
      "List folders at the root by typing 'ls /'.",
      "Navigate to the configurations folder with 'cd /etc' and inspect configurations with 'ls'.",
      "Execute 'pwd' to confirm your absolute current working directory.",
      "Check where active logs are by listing '/var/log'.",
      "Run 'ls -d ~' to view the location of your personal home directory."
    ],
    interviewQuestions: [
      { q: "What is the Filesystem Hierarchy Standard (FHS)?", a: "FHS is a governing standard maintained by the Linux Foundation that defines the structure and layout of directories in a Unix-like operating system, ensuring software compatibility across different distros." },
      { q: "Explain the difference between an Absolute Path and a Relative Path.", a: "An Absolute Path is a direct, complete reference starting from the filesystem root ('/') (e.g., '/var/log/nginx/access.log'). A Relative Path is a context-dependent path relative to the current directory (e.g., 'nginx/access.log' when current directory is '/var/log')." },
      { q: "What is stored in '/proc' and '/sys' directories, and how do they differ from normal files?", a: "They are virtual, in-memory filesystems created by the kernel. They do not occupy physical disk storage. '/proc' contains process-level metrics and active hardware configurations, while '/sys' exposes kernel-level subsystem tunables and power management." },
      { q: "What is the difference between '/bin' and '/usr/bin' in modern Linux?", a: "Historically, '/bin' held core binaries needed to boot the system in single-user mode, while '/usr/bin' held non-essential commands. In modern systems, they are often merged, with '/bin' being a symbolic link pointing directly to '/usr/bin'." },
      { q: "Where does a system administrator look to audit failed ssh login attempts?", a: "On Debian/Ubuntu systems, they look in '/var/log/auth.log'. On Red Hat/CentOS systems, they audit '/var/log/secure'." }
    ]
  },
  {
    id: "linux-lesson-4",
    title: "Lesson 4: Basic Navigation and Directory Management",
    category: "Operating Systems",
    duration: "45 mins",
    objectives: [
      "Navigate folders efficiently using 'cd', 'pwd', and 'ls'.",
      "Understand directory listings, file flags, and hidden files.",
      "Create, nested-create, and remove folders safely."
    ],
    introduction: "Before you can run scripts or edit files, you must master basic terminal navigation, directory creation, and listing operations.",
    explanation: "To interact with directories, you utilize three essential tools: 'pwd' (Print Working Directory) to identify where you are, 'cd' (Change Directory) to move, and 'ls' (List) to view files. Directory management commands like 'mkdir' (Make Directory) let you structure folders, and 'rmdir' lets you clean up empty paths.",
    stepByStep: [
      "Step 1: Check your active directory by executing 'pwd'.",
      "Step 2: List standard directory files with 'ls'. Add '-a' to reveal hidden dotfiles.",
      "Step 3: Move to a target folder using 'cd /path/to/folder'.",
      "Step 4: Create a new folder using 'mkdir folder_name'. Add '-p' to create parent paths simultaneously.",
      "Step 5: Delete empty folders using 'rmdir folder_name'."
    ],
    realWorldExample: "Web developers use 'cd /var/www/html' to access project directories, verify file presence with 'ls -la', and set up resource templates with 'mkdir -p uploads/avatars'.",
    commands: [
      { cmd: "pwd", desc: "Print the absolute pathname of the current working directory." },
      { cmd: "ls -la", desc: "List all contents (including hidden files) with long format detailing permissions." },
      { cmd: "mkdir -p /tmp/shield/ops", desc: "Create nested directories 'shield' and 'ops' concurrently." }
    ],
    diagram: `[Active Location: /home/agent] ─── cd /var/log ───► [Active Location: /var/log]
                                  │
                               ls -l
                                  │
                                  ▼
                     -rw-r--r-- syslog (List files)`,
    notes: [
      "Hidden files in Linux begin with a dot (e.g., '.bashrc') and are hidden from standard 'ls' calls.",
      "'cd -' is a special shortcut that returns you to your previous directory instantly."
    ],
    bestPractices: [
      "Always execute 'pwd' before deleting folders to confirm you are in the correct directory context.",
      "Use descriptive, lowercase, dash-separated names for directories instead of spaces."
    ],
    commonMistakes: [
      "Attempting to use 'cd' to open files (cd is strictly for directory folders).",
      "Running 'mkdir folder' with spaces without quotes, which creates multiple separate folders."
    ],
    quickTips: [
      "Type 'cd' without any arguments to return straight to your user home directory.",
      "Use 'ls -lh' to display file sizes in human-readable formats (e.g., 2K, 44M, 2G)."
    ],
    keyTerms: {
      "PWD": "Print Working Directory - returns the absolute path from '/' to your active directory.",
      "CD": "Change Directory - terminal command used to shift the active folder context.",
      "LS": "List - lists files, directories, permissions, and file modification metadata.",
      "Hidden Files": "Files starting with '.' containing user preferences or administrative environments.",
      "MKDIR": "Make Directory - creates a new folder in the specified pathway."
    },
    summary: "Mastering CLI navigation requires fluency in the 'pwd', 'cd', and 'ls' commands, along with folder construction with 'mkdir'.",
    faq: [
      { q: "How do I create a folder name with spaces?", a: "Wrap the name in quotes: 'mkdir \"My Folder\"', or escape the space: 'mkdir My\\ Folder'." },
      { q: "Why is rmdir failing?", a: "'rmdir' only deletes empty folders. For folders with files, use 'rm -r' instead." }
    ],
    quiz: [
      { question: "Which command prints your absolute active folder directory?", options: ["whoami", "pwd", "ls", "cd"], answer: 1, explanation: "'pwd' (Print Working Directory) displays your absolute path." },
      { question: "Which command modifier is used with 'ls' to show hidden files?", options: ["-h", "-l", "-a", "-t"], answer: 2, explanation: "The '-a' (all) option forces 'ls' to display hidden files starting with '.'." },
      { question: "What happens when you execute the 'cd' command with no parameters?", options: ["It crashes the terminal", "It prints a list of directories", "It returns you to your user's home directory", "It deletes the active folder"], answer: 2, explanation: "Executing 'cd' alone immediately redirects you to your home directory ('~')." },
      { question: "How do you create nested directories like 'admin/files/logs' in one command?", options: ["mkdir -n admin/files/logs", "mkdir -p admin/files/logs", "mkdir -nested admin/files/logs", "make admin/files/logs"], answer: 1, explanation: "The '-p' (parents) flag creates parent directories if they do not already exist." },
      { question: "Which command is used to return to your previously active directory instantly?", options: ["cd ..", "cd -", "cd ~", "cd /"], answer: 1, explanation: "'cd -' is a navigation toggle that brings you back to the previous workspace path." },
      { question: "What error does 'rmdir' throw if you try to delete a directory containing files?", options: ["Permission Denied", "Directory not empty", "File not found", "No error, it succeeds"], answer: 1, explanation: "'rmdir' is designed to safely delete empty folders only." },
      { question: "What does the 'h' option stand for in 'ls -lh'?", options: ["History", "Hidden files", "Human-readable sizing", "Help file display"], answer: 2, explanation: "The '-h' flag formats byte size metrics into easy units (e.g. K, M, G)." },
      { question: "Which command is used to move up exactly one folder level?", options: ["cd /", "cd -", "cd ..", "cd ~"], answer: 2, explanation: "'cd ..' shifts you to the parent directory of the active folder." },
      { question: "How are hidden files distinguished in directory lists?", options: ["They are highlighted in red", "They have a .lnk file type", "They begin with a '.' character", "They reside in /etc"], answer: 2, explanation: "Hidden files are designated with a leading '.' prefix." },
      { question: "What command lets you view a detailed list including file size, owner, and modification times?", options: ["ls -a", "ls -l", "ls -x", "show -l"], answer: 1, explanation: "The '-l' (long listing) option displays complete directory columns." }
    ],
    practicalExercises: [
      "Run 'pwd' to confirm where you are in the directory tree.",
      "Execute 'ls -la' in your home folder and locate your terminal profile config (like '.bashrc' or '.zshrc').",
      "Create a custom playground structure with 'mkdir -p /tmp/cyber/test'.",
      "Change directory into it with 'cd /tmp/cyber/test'.",
      "Run 'cd -' to verify you can return back to your starting home folder instantly."
    ],
    interviewQuestions: [
      { q: "What does 'ls -la' reveal, and what do the first 10 characters in the output stand for?", a: "'ls -la' lists all directories and files in long form. The first 10 characters represent the file type and permissions. The 1st character is the type (e.g., '-' for file, 'd' for directory, 'l' for symlink). The next 9 characters represent permissions in groups of three: user, group, and others (Read, Write, Execute)." },
      { q: "How do you nested-create folders, and what is the danger of not using standard mkdir parameters?", a: "You nested-create folders using the '-p' flag (e.g., 'mkdir -p a/b/c'). Without '-p', mkdir will fail with 'No such file or directory' if the parent folder 'a' or 'b' doesn't exist yet." },
      { q: "Why are some files hidden in Linux, and how do you customize a shell to always display them?", a: "Hidden files are designated with a leading '.' and are typically system environment profiles (like '.bash_profile', '.ssh/'). To display them default, an administrator can edit their '~/.bashrc' file and declare an alias: 'alias ls=\"ls -la\"'." },
      { q: "What is the difference between 'cd /' and 'cd ~'?", a: "'cd /' navigates to the system-wide root folder of the filesystem hierarchy. 'cd ~' navigates to the personal private home folder of the active logged-in user account." },
      { q: "How does 'ls -lh' benefit security auditing operations?", a: "It lets auditors quickly spot unusually large executable payloads or massive, bloated syslog file sizes (e.g., showing '25G' instead of raw bytes) that could indicate massive exfiltration or log spamming." }
    ]
  },
  {
    id: "linux-lesson-5",
    title: "Lesson 5: File Operations and Text Handling",
    category: "Operating Systems",
    duration: "50 mins",
    objectives: [
      "Create empty files and edit timestamps using 'touch'.",
      "Copy, move, rename, and destroy files safely.",
      "View text contents with 'cat', 'less', 'head', and 'tail'."
    ],
    introduction: "System files contain configurations and system audits. Master how to copy, rename, delete, and view documents directly inside the terminal.",
    explanation: "To manipulate files, you utilize 'touch' to create blank files, 'cp' to copy, 'mv' to move or rename, and 'rm' to delete. To read files without loaded desktop applications, you utilize 'cat' to output everything, 'less' to view files line-by-line, and 'head'/'tail' to extract specific lines.",
    stepByStep: [
      "Step 1: Create an empty document using 'touch file.txt'.",
      "Step 2: Copy your document to another location using 'cp file.txt /tmp/'.",
      "Step 3: Rename your document or shift its path using 'mv file.txt new_name.txt'.",
      "Step 4: Read the first 10 lines of a log file using 'head log.txt', or the last 10 lines using 'tail log.txt'.",
      "Step 5: Safely destroy files using 'rm file_name'. Use 'rm -r' to remove directories containing files."
    ],
    realWorldExample: "System administrators use 'tail -f /var/log/nginx/access.log' to dynamically monitor incoming web traffic connections and identify live malicious access requests.",
    commands: [
      { cmd: "touch secure.conf", desc: "Create an empty text configuration file or update its active timestamp." },
      { cmd: "cp -r /etc/ssh /tmp/ssh_backup", desc: "Copy the entire SSH configuration folder recursively into backups." },
      { cmd: "tail -f /var/log/syslog", desc: "Follow active system message logs dynamically in real-time." }
    ],
    diagram: `[ cp file.txt copy.txt ] ───► Creates an identical file copy
[ mv file.txt /tmp/   ] ───► Relocates file, deleting original
[ rm file.txt         ] ───► Permanently destroys file (No Recycle Bin!)`,
    notes: [
      "There is NO Recycle Bin in the Linux command-line. Once you delete a file with 'rm', it is permanently unlinked.",
      "The '-f' flag in 'tail' stands for 'follow' and stays open to stream new text modifications in real-time."
    ],
    bestPractices: [
      "Use 'cp -p' to preserve timestamps and permissions when copying critical administrative configurations.",
      "Always use 'rm -i' when deleting highly sensitive files to receive interactive confirmations."
    ],
    commonMistakes: [
      "Running 'rm -rf' on root paths due to command typos (this wipes the entire operating system).",
      "Using 'cat' to view massive multi-gigabyte log files, which floods your terminal and locks memory."
    ],
    quickTips: [
      "Press 'q' to exit 'less' reader views immediately.",
      "Use 'tail -n 25 log.txt' to print exactly the last 25 lines instead of the default 10."
    ],
    keyTerms: {
      "TOUCH": "Command used to create a blank text document or update file access timestamps.",
      "CP": "Copy - copies selected documents or directory trees to new target destinations.",
      "MV": "Move - moves documents to folders, or renames files directly inside directories.",
      "RM": "Remove - deletes specified files. Relies on recursion ('-r') for directory cleanups.",
      "LESS": "An interactive terminal text pager utility that supports upward and downward navigation."
    },
    summary: "Managing terminal systems requires fluent usage of file operation controls ('cp', 'mv', 'rm') and text pager utilities ('less', 'tail', 'cat').",
    faq: [
      { q: "How do I copy directories?", a: "You must include the recursive '-r' option: 'cp -r folder_name copy_name'." },
      { q: "How can I search for text inside less?", a: "Type '/' followed by your keyword inside the less utility and press Enter." }
    ],
    quiz: [
      { question: "Which command is used to create an empty text file instantly?", options: ["create", "mkdir", "touch", "cat"], answer: 2, explanation: "'touch' creates a blank file or updates existing file timestamps." },
      { question: "What does 'cp -r' achieve?", options: ["Renames a folder", "Copies files in reverse", "Copies a directory recursively, including all nested files", "Deletes directories"], answer: 2, explanation: "The recursive flag '-r' copies folders and their entire sub-contents." },
      { question: "Which command renames 'config.txt' to 'setup.txt'?", options: ["cp config.txt setup.txt", "mv config.txt setup.txt", "rename config.txt setup.txt", "touch config.txt setup.txt"], answer: 1, explanation: "'mv' moves a file to a new name, effectively renaming it." },
      { question: "Is there a built-in recovery trash bin for 'rm' in the CLI?", options: ["Yes, under /trash", "Only for superusers", "No, deletion is immediate and permanent", "Yes, if you press Ctrl+Z"], answer: 2, explanation: "'rm' deletes files at the filesystem level. Deletion is unrecoverable." },
      { question: "Which text pager tool lets you scroll both up and down in large documents?", options: ["cat", "less", "head", "echo"], answer: 1, explanation: "'less' is a terminal file pager supporting bidirectional navigation." },
      { question: "How do you view exactly the last 15 lines of a document?", options: ["head -n 15 doc.txt", "tail -15 doc.txt", "less -n 15 doc.txt", "cat -l 15 doc.txt"], answer: 1, explanation: "'tail -n 15' extracts specified lines from the bottom of the document." },
      { question: "What does the '-f' option achieve in 'tail -f'?", options: ["Filters matching text", "Forces file deletion", "Follows the file, showing updates in real-time", "Finds hidden directories"], answer: 2, explanation: "The follow '-f' flag streams lines to the terminal in real-time as they are written." },
      { question: "What command copies 'info.txt' to the '/tmp' directory?", options: ["mv info.txt /tmp", "cp info.txt /tmp", "touch info.txt /tmp", "mkdir /tmp/info.txt"], answer: 1, explanation: "'cp' copies the source file to target folder without deleting the source." },
      { question: "Which command deletes an entire non-empty directory 'data'?", options: ["rmdir data", "rm -r data", "rm data", "delete data"], answer: 1, explanation: "Non-empty folders require the recursive '-r' (or '-rf') command to be deleted." },
      { question: "What does 'head -n 5 file.txt' do?", options: ["Shows the first 5 characters", "Shows the first 5 lines", "Deletes 5 lines", "Replaces 5 lines"], answer: 1, explanation: "It prints the top 5 lines of the specified text document." }
    ],
    practicalExercises: [
      "Create an empty audit report with 'touch audit.log'.",
      "Copy it to backups by executing 'cp audit.log audit_backup.log'.",
      "Rename it by executing 'mv audit.log active_ops.log'.",
      "View the first 5 lines of '/etc/passwd' using 'head -n 5 /etc/passwd'.",
      "Follow updates to a temporary folder syslog using 'tail -n 10 /etc/services'."
    ],
    interviewQuestions: [
      { q: "What is the difference between 'cat' and 'less' for inspecting log files?", a: "'cat' prints the entire file to stdout in one rapid dump, which is dangerous for huge logs (e.g., gigabytes) as it consumes massive CPU, floods memory, and blocks interaction. 'less' loads the file page-by-page, allowing smooth scrolling, searching, and uses minimal memory footprint regardless of file size." },
      { q: "Why is 'rm -rf' dangerous, and how do system administrators mitigate its risk?", a: "'rm -rf' deletes folders recursively ('-r') and forcefully ('-f') without prompts. If run on root paths (like 'rm -rf /' or 'rm -rf *' on miscalculated relative paths), it wipes out the whole OS. Administrators mitigate this by avoiding root logins, using file protection flags, aliasing 'rm' to 'rm -i', and relying on offline backups." },
      { q: "Explain how 'tail -f' is used during an active network security audit.", a: "'tail -f' keeps the file open and dynamically outputs newly appended lines. Security auditors run 'tail -f /var/log/auth.log' or access.log during testing to watch live auth queries, monitor password attempts, scan brute-force triggers, and detect active intrusions in real-time." },
      { q: "How do you preserve file metadata (ownership, timestamps) when copying critical system configuration files?", a: "By using the '-p' flag (e.g. 'cp -p active.conf backup.conf'), or the '-a' (archive) flag, which copies folders recursively while preserving user ownership, modification timestamps, and permissions." },
      { q: "What does 'mv file1 file2' do on the system level?", a: "If 'file2' resides in the same filesystem, 'mv' simply updates the directory entry mapping to the same inode on the disk, making the rename extremely fast and efficient. If 'file2' is on a separate disk partition, the system copies the physical bytes to the new drive and unlinks the original." }
    ]
  }
];
