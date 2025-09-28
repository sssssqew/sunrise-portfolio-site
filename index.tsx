import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- DATA & TYPES --- //

type ProjectType = 'Frontend' | 'UX Design';

interface Project {
  id: string;
  title: string;
  type: ProjectType;
  imageUrl: string;
  duration: string; // e.g., "3 Weeks"
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  outcome: string;
  stack: string[];
  tags: string[];
  date: string; // YYYY-MM-DD for sorting
}

// --- MOCK DATA --- //

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform Redesign',
    type: 'UX Design',
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOT二次MDd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2V8ZW58MHx8fHwxNzE3Mjc2ODU5fDA&ixlib=rb-4.0.3&q=80&w=1080',
    duration: '8 Weeks',
    difficulty: 'Hard',
    outcome: 'Increased user conversion by 25% through a streamlined checkout process and intuitive navigation.',
    stack: ['Figma', 'UserTesting.com', 'Miro', 'Hotjar'],
    tags: ['E-commerce', 'UI/UX', 'Research', 'Mobile-First'],
    date: '2023-11-15',
  },
  {
    id: '2',
    title: 'Interactive Data Dashboard',
    type: 'Frontend',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOT二次MDd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmR8ZW58MHx8fHwxNzE3Mjc2OTE0fDA&ixlib=rb-4.0.3&q=80&w=1080',
    duration: '6 Weeks',
    difficulty: 'Expert',
    outcome: 'Developed a real-time analytics dashboard handling over 100,000 data points with seamless performance.',
    stack: ['React', 'TypeScript', 'D3.js', 'Node.js', 'WebSocket'],
    tags: ['Data Viz', 'Real-Time', 'Performance', 'API'],
    date: '2024-01-20',
  },
    {
    id: '3',
    title: 'Mobile Banking App Concept',
    type: 'UX Design',
    imageUrl: 'https://images.unsplash.com/photo-1580974928074-b4a397a618d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOT二次MDd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBiYW5raW5nfGVufDB8fHx8MTcxNzI3Njk4OHww&ixlib=rb-4.0.3&q=80&w=1080',
    duration: '4 Weeks',
    difficulty: 'Medium',
    outcome: 'Designed a user-centric mobile banking app focused on accessibility and financial literacy for young adults.',
    stack: ['Figma', 'Adobe XD', 'Protopie'],
    tags: ['Fintech', 'Mobile', 'Accessibility', 'Prototyping'],
    date: '2023-09-05',
  },
  {
    id: '4',
    title: 'Portfolio Website',
    type: 'Frontend',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOT二次MDd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjB3ZWJzaXRlfGVufDB8fHx8MTcxNzI3NzAzNHww&ixlib=rb-4.0.3&q=80&w=1080',
    duration: '2 Weeks',
    difficulty: 'Medium',
    outcome: 'Built a personal portfolio with a fully functional admin panel and modern scroll animations.',
    stack: ['React', 'TypeScript', 'CSS Animations'],
    tags: ['Portfolio', 'React', 'SPA'],
    date: '2024-03-10',
  },
];

// --- UTILITY HOOKS & FUNCTIONS --- //

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

// FIX: Made useAnimatedVisibility generic and explicitly typed its return tuple
// to fix type inference issues with the returned ref.
const useAnimatedVisibility = <T extends HTMLElement>(options = { threshold: 0.1, triggerOnce: true }): [React.RefObject<T>, boolean] => {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (options.triggerOnce && ref.current) {
                    observer.unobserve(ref.current);
                }
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};


// --- UI COMPONENTS --- //

const Header: React.FC<{
    activePage: string;
    setActivePage: (page: string) => void;
}> = ({ activePage, setActivePage }) => {
    return (
        <header className="header">
            <div className="container">
                <div className="logo" onClick={() => setActivePage('Frontend')}>
                    <span>JOHN DOE</span>
                </div>
                <nav>
                    <ul>
                        <li className={activePage === 'Frontend' ? 'active' : ''} onClick={() => setActivePage('Frontend')}>Frontend</li>
                        <li className={activePage === 'UX Design' ? 'active' : ''} onClick={() => setActivePage('UX Design')}>UX Design</li>
                        <li className={activePage === 'About' ? 'active' : ''} onClick={() => setActivePage('About')}>About Me</li>
                    </ul>
                </nav>
                 <div className="admin-link" onClick={() => setActivePage('AdminLogin')} title="Admin Panel">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L2 5v6c0 5.55 3.84 10.74 9 12 .34-.08.66-.2.98-.36-.88-1.02-1.48-2.26-1.48-3.64 0-2.76 2.24-5 5-5 .34 0 .68.03 1 .09V5l-8-3.6zM20.19 14.83c-1.35-1.01-3.28-1.1-4.2-.28-.9.8-1.01 2.72-.28 4.2.73 1.48 2.65 2.14 4.2 1.25s2.14-2.65 1.25-4.2c-.39-.68-.94-1.23-1.62-1.62l.35.35L19.5 13l-1.41-1.41-1.06 1.06.35.35c.34-.17.65-.41.92-.7z"></path></svg>
                </div>
            </div>
        </header>
    );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    // FIX: Specified the element type for the generic useAnimatedVisibility hook.
    const [ref, isVisible] = useAnimatedVisibility<HTMLDivElement>();
    return (
        <div ref={ref} className={`project-card ${isVisible ? 'visible' : ''}`}>
            <div className="card-image" style={{ backgroundImage: `url(${project.imageUrl})` }}></div>
            <div className="card-content">
                <span className="card-type">{project.type}</span>
                <h3>{project.title}</h3>
                <p className="card-outcome">{project.outcome}</p>
                <div className="card-details">
                    <span><strong>Duration:</strong> {project.duration}</span>
                    <span><strong>Difficulty:</strong> {project.difficulty}</span>
                </div>
                <div className="card-stack">
                    <strong>Tech Stack:</strong>
                    <div>{project.stack.join(', ')}</div>
                </div>
                <div className="card-tags">
                    {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
            </div>
        </div>
    );
};

const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => {
    if (projects.length === 0) {
        return <p className="no-projects">No projects found for the current filters.</p>;
    }
    return (
        <div className="project-grid">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
    );
};

// --- PAGES / VIEWS --- //

const PortfolioPage: React.FC<{ projects: Project[], type: ProjectType }> = ({ projects, type }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'>('date-desc');
    const [showSort, setShowSort] = useState(false);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        projects.forEach(p => p.tags.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [projects]);

    const filteredProjects = useMemo(() => {
        return projects
            .filter(p => p.type === type)
            .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
            .filter(p => selectedTags.length === 0 || selectedTags.every(st => p.tags.includes(st)))
            .sort((a, b) => {
                switch (sortOrder) {
                    case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
                    case 'title-asc': return a.title.localeCompare(b.title);
                    case 'title-desc': return b.title.localeCompare(a.title);
                    case 'date-desc':
                    default:
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
            });
    }, [projects, type, searchTerm, selectedTags, sortOrder]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };
    
    return (
        <main className="container page-content">
            <div className="filters">
                <input
                    type="search"
                    placeholder={`Search in ${type} projects...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                    aria-label="Search projects"
                />
                <div className="sort-container">
                    <button onClick={() => setShowSort(!showSort)} className="icon-button" aria-label="Sort options">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></svg>
                    </button>
                    {showSort && (
                        <div className="sort-menu">
                            <button onClick={() => { setSortOrder('date-desc'); setShowSort(false); }}>Newest First</button>
                            <button onClick={() => { setSortOrder('date-asc'); setShowSort(false); }}>Oldest First</button>
                            <button onClick={() => { setSortOrder('title-asc'); setShowSort(false); }}>Title (A-Z)</button>
                            <button onClick={() => { setSortOrder('title-desc'); setShowSort(false); }}>Title (Z-A)</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="tag-filters">
                {allTags.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)} className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}>{tag}</button>
                ))}
            </div>
            <ProjectList projects={filteredProjects} />
        </main>
    );
};

const AboutPage: React.FC = () => {
    // FIX: Specified the element type for the generic useAnimatedVisibility hook.
    const [ref, isVisible] = useAnimatedVisibility<HTMLElement>();
    return (
        <main ref={ref} className={`container page-content about-page ${isVisible ? 'visible' : ''}`}>
            <div className="about-content">
                 <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOT二次MDd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjB3ZWJzaXRlfGVufDB8fHx8MTcxNzI3NzAzNHww&ixlib=rb-4.0.3&q=80&w=1080" alt="John Doe" className="about-photo" />
                <div className="about-text">
                    <h1>About Me</h1>
                    <p>
                        I am a passionate and creative Frontend Developer and UX Designer with a decade of experience in building beautiful, functional, and user-centered digital experiences. My expertise lies at the intersection of design and technology, where I strive to create intuitive interfaces that not only look stunning but also perform flawlessly.
                    </p>
                    <p>
                        From initial user research and wireframing to high-fidelity prototypes and pixel-perfect code, I manage the entire product design lifecycle. I thrive in collaborative environments and am dedicated to solving complex problems with elegant solutions.
                    </p>
                    <h3>Core Skills</h3>
                    <ul>
                        <li>UI/UX Design & Research</li>
                        <li>Responsive Web Design</li>
                        <li>Frontend Development (React, TypeScript, Vue)</li>
                        <li>Interaction Design & Prototyping</li>
                        <li>Design Systems & Component Libraries</li>
                    </ul>
                </div>
            </div>
        </main>
    );
};

const AdminLogin: React.FC<{
    setLoggedIn: (loggedIn: boolean) => void;
    adminPassword: string
}> = ({ setLoggedIn, adminPassword }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === adminPassword) {
            sessionStorage.setItem('admin-logged-in', 'true');
            setLoggedIn(true);
        } else {
            setError('Incorrect password.');
        }
    };
    return (
        <main className="container page-content">
            <form onSubmit={handleSubmit} className="admin-login-form">
                <h2>Admin Login</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    aria-label="Admin password"
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </main>
    );
};

const ProjectForm: React.FC<{
    project?: Project;
    onSave: (project: Project) => void;
    onCancel: () => void;
}> = ({ project, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Project, 'id' | 'date'>>({
        title: project?.title || '',
        type: project?.type || 'Frontend',
        imageUrl: project?.imageUrl || '',
        duration: project?.duration || '',
        difficulty: project?.difficulty || 'Medium',
        outcome: project?.outcome || '',
        stack: project?.stack || [],
        tags: project?.tags || [],
    });
    const [imagePreview, setImagePreview] = useState<string | null>(project?.imageUrl || null);
    const [stackInput, setStackInput] = useState(project?.stack?.join(', ') || '');
    const [tagsInput, setTagsInput] = useState(project?.tags?.join(', ') || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStackInput(value);
        setFormData(prev => ({ ...prev, stack: value.split(',').map(s => s.trim()).filter(Boolean) }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTagsInput(value);
        setFormData(prev => ({ ...prev, tags: value.split(',').map(s => s.trim()).filter(Boolean) }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, imageUrl: base64String }));
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalProject: Project = {
            ...formData,
            id: project?.id || Date.now().toString(),
            date: project?.date || new Date().toISOString().split('T')[0],
        };
        onSave(finalProject);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
            <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="Frontend">Frontend</option>
                    <option value="UX Design">UX Design</option>
                </select>
            </div>
             <div className="form-group">
                <label>Cover Image</label>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>
            <div className="form-group">
                <label>Image URL (or upload)</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Duration</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                    <option>Expert</option>
                </select>
            </div>
            <div className="form-group">
                <label>Outcome</label>
                <textarea name="outcome" value={formData.outcome} onChange={handleChange} rows={4}></textarea>
            </div>
            <div className="form-group">
                <label>Tech Stack (comma-separated)</label>
                <input type="text" value={stackInput} onChange={handleStackChange} />
            </div>
            <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input type="text" value={tagsInput} onChange={handleTagsChange} />
            </div>
            <div className="form-actions">
                <button type="submit" className="button-primary">Save Project</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

const AdminDashboard: React.FC<{
    projects: Project[];
    setProjects: (projects: Project[] | ((p: Project[]) => Project[])) => void;
    adminPassword: string;
    setAdminPassword: (password: string) => void;
    setLoggedIn: (loggedIn: boolean) => void;
}> = ({ projects, setProjects, adminPassword, setAdminPassword, setLoggedIn }) => {
    const [editingProject, setEditingProject] = useState<Project | null | 'new'>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);


    const handleSaveProject = (project: Project) => {
        setProjects(prevProjects => {
            const index = prevProjects.findIndex(p => p.id === project.id);
            if (index > -1) {
                const newProjects = [...prevProjects];
                newProjects[index] = project;
                return newProjects;
            }
            return [project, ...prevProjects];
        });
        setEditingProject(null);
    };
    
    const handleDeleteProject = (id: string) => {
        if(window.confirm('Are you sure you want to delete this project?')) {
            setProjects(prevProjects => prevProjects.filter(p => p.id !== id));
        }
    };
    
    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMessage('Passwords do not match.');
            return;
        }
        if (newPassword.length < 4) {
            setPasswordMessage('Password must be at least 4 characters long.');
            return;
        }
        setAdminPassword(newPassword);
        setPasswordMessage('Password changed successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMessage(''), 3000);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin-logged-in');
        setLoggedIn(false);
    };
    
    const handleDragSort = () => {
        const dragIndex = dragItem.current;
        const hoverIndex = dragOverItem.current;

        if (dragIndex === null || hoverIndex === null || dragIndex === hoverIndex) {
            dragItem.current = null;
            dragOverItem.current = null;
            return;
        }

        setProjects(currentProjects => {
            const reorderedProjects = [...currentProjects];
            const [draggedItem] = reorderedProjects.splice(dragIndex, 1);
            reorderedProjects.splice(hoverIndex, 0, draggedItem);
            return reorderedProjects;
        });

        dragItem.current = null;
        dragOverItem.current = null;
    };


    if (editingProject) {
        return (
            <main className="container page-content">
                <ProjectForm
                    project={editingProject === 'new' ? undefined : editingProject}
                    onSave={handleSaveProject}
                    onCancel={() => setEditingProject(null)}
                />
            </main>
        );
    }
    
    return (
        <main className="container page-content admin-dashboard">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <div>
                  <button onClick={() => setEditingProject('new')} className="add-project-button" title="Add New Project" aria-label="Add new project">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                  </button>
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </div>
            
            <div className="admin-projects-list">
                <h3>Manage Projects</h3>
                {projects.map((p, index) => (
                    <div 
                        key={p.id} 
                        className="admin-project-item"
                        draggable
                        onDragStart={(e) => {
                            if (e.target instanceof HTMLElement && e.target.closest('.item-actions')) {
                                e.preventDefault();
                                return;
                            }
                            dragItem.current = index
                        }}
                        onDragEnter={() => dragOverItem.current = index}
                        onDragEnd={handleDragSort}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <div className="drag-handle">::</div>
                        <span>{p.title} ({p.type})</span>
                        <div className="item-actions">
                             <button 
                                onClick={() => setEditingProject(p)} 
                                className="icon-button" 
                                title="Edit" 
                                aria-label="Edit project"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                            </button>
                            <button 
                                onClick={() => handleDeleteProject(p.id)} 
                                className="icon-button delete" 
                                title="Delete" 
                                aria-label="Delete project"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-password-change">
                <h3>Change Password</h3>
                <form onSubmit={handleChangePassword}>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" required />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required />
                    <button type="submit">Change Password</button>
                </form>
                {passwordMessage && <p className="password-message">{passwordMessage}</p>}
            </div>
        </main>
    );
};

// --- MAIN APP COMPONENT --- //

const App: React.FC = () => {
    const [projects, setProjects] = useLocalStorage<Project[]>('portfolio-projects', MOCK_PROJECTS);
    const [adminPassword, setAdminPassword] = useLocalStorage<string>('admin-password', '0000');
    const [loggedIn, setLoggedIn] = useState(() => !!sessionStorage.getItem('admin-logged-in'));
    const [activePage, setActivePage] = useState('Frontend');

    const renderPage = () => {
        if (loggedIn) {
             return <AdminDashboard 
                        projects={projects}
                        setProjects={setProjects}
                        adminPassword={adminPassword}
                        setAdminPassword={setAdminPassword}
                        setLoggedIn={setLoggedIn}
                    />;
        }

        switch (activePage) {
            case 'Frontend':
                return <PortfolioPage projects={projects} type="Frontend" />;
            case 'UX Design':
                return <PortfolioPage projects={projects} type="UX Design" />;
            case 'About':
                return <AboutPage />;
            case 'AdminLogin':
                return <AdminLogin setLoggedIn={setLoggedIn} adminPassword={adminPassword} />;
            default:
                return <PortfolioPage projects={projects} type="Frontend" />;
        }
    };
    
    // If logged in, force view to admin panel
    useEffect(() => {
        if (loggedIn) {
            setActivePage('Admin');
        } else if (activePage === 'Admin') {
            setActivePage('Frontend');
        }
    }, [loggedIn]);


    return (
        <>
            <Header activePage={activePage} setActivePage={setActivePage} />
            {renderPage()}
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);