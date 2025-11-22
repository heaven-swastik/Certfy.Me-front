import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Download, Upload, Loader, X, CheckCircle, Search, ChevronDown, Move, Zap, FileText } from 'lucide-react';
import JSZip from 'jszip';

// Static Font List with Categories
const STATIC_FONT_LIST = [
    // Sans-Serif
    { family: 'Poppins', variants: '700', category: 'Sans-Serif' },
    { family: 'Roboto', variants: '700', category: 'Sans-Serif' },
    { family: 'Montserrat', variants: '700', category: 'Sans-Serif' },
    { family: 'Oswald', variants: '700', category: 'Sans-Serif' },
    { family: 'Lato', variants: '700', category: 'Sans-Serif' },
    { family: 'Raleway', variants: '700', category: 'Sans-Serif' },
    { family: 'Rubik', variants: '700', category: 'Sans-Serif' },
    { family: 'Ubuntu', variants: '700', category: 'Sans-Serif' },
    { family: 'Quicksand', variants: '700', category: 'Sans-Serif' },
    { family: 'Inter', variants: '700', category: 'Sans-Serif' },
    { family: 'Nunito', variants: '700', category: 'Sans-Serif' },
    { family: 'Work Sans', variants: '700', category: 'Sans-Serif' },
    { family: 'Hind', variants: '700', category: 'Sans-Serif' },
    { family: 'Space Grotesk', variants: '700', category: 'Sans-Serif' },
    { family: 'Source Sans Pro', variants: '700', category: 'Sans-Serif' },
    { family: 'Karla', variants: '700', category: 'Sans-Serif' },
    { family: 'Mulish', variants: '700', category: 'Sans-Serif' },
    { family: 'Exo 2', variants: '700', category: 'Sans-Serif' },
    { family: 'DM Sans', variants: '700', category: 'Sans-Serif' },
    { family: 'Jost', variants: '700', category: 'Sans-Serif' },
    { family: 'Sora', variants: '700', category: 'Sans-Serif' },
    { family: 'Titillium Web', variants: '700', category: 'Sans-Serif' },
    { family: 'Barlow', variants: '700', category: 'Sans-Serif' },
    { family: 'Fira Sans', variants: '700', category: 'Sans-Serif' },
    { family: 'Archivo', variants: '700', category: 'Sans-Serif' },
    { family: 'Didact Gothic', variants: '400', category: 'Sans-Serif' },
    { family: 'Manrope', variants: '700', category: 'Sans-Serif' },
    { family: 'Urbanist', variants: '700', category: 'Sans-Serif' },
    { family: 'Sen', variants: '700', category: 'Sans-Serif' },
    { family: 'Chivo', variants: '700', category: 'Sans-Serif' },

    // Serif
    { family: 'Playfair Display', variants: '700', category: 'Serif' },
    { family: 'Merriweather', variants: '700', category: 'Serif' },
    { family: 'Cormorant Garamond', variants: '700', category: 'Serif' },
    { family: 'Cinzel', variants: '700', category: 'Serif' },
    { family: 'Libre Baskerville', variants: '700', category: 'Serif' },
    { family: 'Noto Serif', variants: '700', category: 'Serif' },
    { family: 'Lora', variants: '700', category: 'Serif' },
    { family: 'EB Garamond', variants: '700', category: 'Serif' },
    { family: 'Crimson Pro', variants: '700', category: 'Serif' },
    { family: 'Spectral', variants: '700', category: 'Serif' },
    { family: 'Bodoni Moda', variants: '700', category: 'Serif' },
    { family: 'PT Serif', variants: '700', category: 'Serif' },
    { family: 'Vollkorn', variants: '700', category: 'Serif' },
    { family: 'Cardo', variants: '700', category: 'Serif' },
    { family: 'Bitter', variants: '700', category: 'Serif' },
    { family: 'Zilla Slab', variants: '700', category: 'Serif' },
    { family: 'Rosarivo', variants: '700', category: 'Serif' },
    { family: 'Taviraj', variants: '700', category: 'Serif' },

    // Cursive/Script
    { family: 'Dancing Script', variants: '700', category: 'Cursive/Script' },
    { family: 'Great Vibes', variants: '400', category: 'Cursive/Script' },
    { family: 'Sacramento', variants: '400', category: 'Cursive/Script' },
    { family: 'Allura', variants: '400', category: 'Cursive/Script' },
    { family: 'Parisienne', variants: '400', category: 'Cursive/Script' },
    { family: 'Pacifico', variants: '400', category: 'Cursive/Script' },
    { family: 'Yellowtail', variants: '400', category: 'Cursive/Script' },
    { family: 'Cookie', variants: '400', category: 'Cursive/Script' },
    { family: 'Marck Script', variants: '400', category: 'Cursive/Script' },
    { family: 'Satisfy', variants: '400', category: 'Cursive/Script' },
    { family: 'Homemade Apple', variants: '400', category: 'Cursive/Script' },
    { family: 'Mr Dafoe', variants: '400', category: 'Cursive/Script' },
    { family: 'Alex Brush', variants: '400', category: 'Cursive/Script' },
    { family: 'Bad Script', variants: '400', category: 'Cursive/Script' },
    { family: 'Rouge Script', variants: '400', category: 'Cursive/Script' },

    // Handwriting
    { family: 'Permanent Marker', variants: '400', category: 'Handwriting' },
    { family: 'Caveat', variants: '700', category: 'Handwriting' },
    { family: 'Indie Flower', variants: '400', category: 'Handwriting' },
    { family: 'Amatic SC', variants: '700', category: 'Handwriting' },
    { family: 'Patrick Hand', variants: '400', category: 'Handwriting' },
    { family: 'Gloria Hallelujah', variants: '400', category: 'Handwriting' },
    { family: 'Shadows Into Light', variants: '400', category: 'Handwriting' },
    { family: 'Handlee', variants: '400', category: 'Handwriting' },
    { family: 'Rock Salt', variants: '400', category: 'Handwriting' },
    { family: 'Kalam', variants: '700', category: 'Handwriting' },
    { family: 'Gochi Hand', variants: '400', category: 'Handwriting' },
    { family: 'Reenie Beanie', variants: '400', category: 'Handwriting' },
    { family: 'Amita', variants: '700', category: 'Handwriting' },

    // Display/Headline
    { family: 'Bebas Neue', variants: '400', category: 'Display/Headline' },
    { family: 'Anton', variants: '400', category: 'Display/Headline' },
    { family: 'Righteous', variants: '400', category: 'Display/Headline' },
    { family: 'Lobster', variants: '400', category: 'Display/Headline' },
    { family: 'Staatliches', variants: '400', category: 'Display/Headline' },
    { family: 'Abril Fatface', variants: '400', category: 'Display/Headline' },
    { family: 'Alfa Slab One', variants: '400', category: 'Display/Headline' },
    { family: 'Bangers', variants: '400', category: 'Display/Headline' },
    { family: 'Black Ops One', variants: '400', category: 'Display/Headline' },
    { family: 'Teko', variants: '700', category: 'Display/Headline' },
    { family: 'Russo One', variants: '400', category: 'Display/Headline' },
    { family: 'Orbitron', variants: '700', category: 'Display/Headline' },
    { family: 'Press Start 2P', variants: '400', category: 'Display/Headline' },
    { family: 'Monoton', variants: '400', category: 'Display/Headline' },
    { family: 'Fredoka One', variants: '400', category: 'Display/Headline' },
    { family: 'Passion One', variants: '700', category: 'Display/Headline' },
    { family: 'Paytone One', variants: '400', category: 'Display/Headline' },

    // Decorative
    { family: 'Unica One', variants: '400', category: 'Decorative' },
    { family: 'Carter One', variants: '400', category: 'Decorative' },
    { family: 'Ranchers', variants: '400', category: 'Decorative' },
    { family: 'Shrikhand', variants: '400', category: 'Decorative' },
    { family: 'Fugaz One', variants: '400', category: 'Decorative' },
    { family: 'Bungee', variants: '400', category: 'Decorative' },
    { family: 'Rampart One', variants: '400', category: 'Decorative' },
    { family: 'Faster One', variants: '400', category: 'Decorative' },
    { family: 'Ribeye', variants: '400', category: 'Decorative' },
    { family: 'Fruktur', variants: '400', category: 'Decorative' },
    { family: 'Londrina Outline', variants: '400', category: 'Decorative' },
    { family: 'Modak', variants: '400', category: 'Decorative' },
    { family: 'Coiny', variants: '400', category: 'Decorative' },
    { family: 'Chela One', variants: '400', category: 'Decorative' },
];

const ALL_CATEGORIES = ['All', ...new Set(STATIC_FONT_LIST.map(f => f.category))].sort();

// Drag Text Component
const DragText = ({ containerRef, onPositionChange, textStyles, fontFamily }) => {
    const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);

    const getPixelPosition = useCallback(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            return { x: position.x * width, y: position.y * height };
        }
        return { x: 0, y: 0 };
    }, [containerRef, position]);

    useEffect(() => {
        if (containerRef.current && !isDragging) {
            onPositionChange(position.x, position.y);
        }
    }, [containerRef.current, onPositionChange, position.x, position.y, isDragging]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging || !containerRef.current) return;

            const container = containerRef.current.getBoundingClientRect();
            let newXRelative = (e.clientX - container.left) / container.width;
            let newYRelative = (e.clientY - container.top) / container.height;
            newXRelative = Math.max(0, Math.min(newXRelative, 1));
            newYRelative = Math.max(0, Math.min(newYRelative, 1));
            setPosition({ x: newXRelative, y: newYRelative });
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, containerRef]);

    const pixelPosition = getPixelPosition();
    const guideClass = isDragging
        ? 'opacity-100 border-[#c9a860] border-2 shadow-lg'
        : 'opacity-0 group-hover:opacity-60 border-gray-400 border-2';

    return (
        <div
            ref={dragRef}
            onMouseDown={handleMouseDown}
            style={{
                left: pixelPosition.x,
                top: pixelPosition.y,
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: 50,
            }}
            className="group"
        >
            <div
                style={{
                    fontFamily: fontFamily,
                    fontSize: `${textStyles.fontSize}px`,
                    color: textStyles.color,
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    fontWeight: '700',
                    lineHeight: 1
                }}
                className={`drop-shadow-xl transition-all duration-200 p-1 ${isDragging ? 'scale-105' : 'scale-100'}`}
            >
                [Sample Name Preview]
            </div>

            <div className={`absolute inset-0 -m-3 border-dashed transition-opacity pointer-events-none rounded ${guideClass}`}>
                {isDragging && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#c9a860] text-white text-xs px-3 py-1 whitespace-nowrap rounded shadow-lg font-medium">
                        X: {Math.round(position.x * 100)} | Y: {Math.round(position.y * 100)}
                    </div>
                )}
                <Move size={16} className="absolute inset-0 m-auto text-[#c9a860] opacity-80" />
            </div>
        </div>
    );
};

// Main App
function AppMain() {
    const [templateFile, setTemplateFile] = useState(null);
    const [templateUrl, setTemplateUrl] = useState(null);
    const [csvFile, setCsvFile] = useState(null);

    const initialFont = STATIC_FONT_LIST[0];
    const [allFonts] = useState(STATIC_FONT_LIST);
    const [filteredFonts, setFilteredFonts] = useState(STATIC_FONT_LIST);
    const [fontSearch, setFontSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedFont, setSelectedFont] = useState(initialFont);

    const [styles, setStyles] = useState({
        fontSize: 60,
        color: '#0F172A',
    });

    const [dragPos, setDragPos] = useState({ x: 0.5, y: 0.5 });
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const containerRef = useRef(null);

    const loadFontCSS = useCallback((fontFamily, variants = '700') => {
        return new Promise((resolve) => {
            const existingLink = document.getElementById('current-google-font');
            if (existingLink) {
                document.head.removeChild(existingLink);
            }

            const link = document.createElement('link');
            link.id = 'current-google-font';
            link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s/g, '+')}:wght@${variants}&display=swap`;
            link.rel = 'stylesheet';
            link.onload = () => setTimeout(() => resolve(), 100);
            link.onerror = () => resolve();
            document.head.appendChild(link);
        });
    }, []);

    useEffect(() => {
        if (selectedFont) {
            loadFontCSS(selectedFont.family, selectedFont.variants);
        }
    }, [selectedFont, loadFontCSS]);

    useEffect(() => {
        const lowerSearch = fontSearch.toLowerCase();
        let fontList = allFonts;

        if (selectedCategory !== 'All') {
            fontList = fontList.filter(font => font.category === selectedCategory);
        }

        if (lowerSearch) {
            fontList = fontList.filter(font =>
                font.family.toLowerCase().includes(lowerSearch)
            );
        }

        setFilteredFonts(fontList.slice(0, 150));
    }, [fontSearch, selectedCategory, allFonts]);

    const parseCSV = (csvText) => {
        const rows = csvText.trim().split('\n').filter(row => row.trim() !== '');
        if (rows.length < 2) return [];

        return rows.slice(1)
            .map(row => row.split(',')[0].trim())
            .filter(name => name.length > 0);
    };

    const generateCertificate = useCallback(async (name) => {
        if (!templateUrl) return null;

        await loadFontCSS(selectedFont.family, selectedFont.variants);
        await new Promise(resolve => setTimeout(resolve, 300));

        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.crossOrigin = "anonymous";
            img.src = templateUrl;

            img.onload = () => {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const previewHeight = containerRef.current?.clientHeight || 1000;
                const scaleFactor = canvas.height / previewHeight;
                const scaledFontSize = styles.fontSize * scaleFactor;

                const xPos = dragPos.x * canvas.width;
                const yPos = dragPos.y * canvas.height;

                const fontWeight = selectedFont.variants.includes('700') ? '700' : '400';

                ctx.font = `${fontWeight} ${scaledFontSize}px "${selectedFont.family}"`;
                ctx.fillStyle = styles.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                ctx.shadowBlur = scaledFontSize * 0.02;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                ctx.fillText(name, xPos, yPos);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/png', 1.0);
            };

            img.onerror = () => {
                console.error("Error loading template image for canvas.");
                resolve(null);
            };
        });
    }, [templateUrl, dragPos, styles, selectedFont, loadFontCSS]);

    const handleGenerate = useCallback(async () => {
        if (!templateFile || !csvFile) {
            setStatusMessage({ type: 'error', text: "Template and CSV files are required." });
            return;
        }

        setLoading(true);
        setStatusMessage({ type: 'info', text: "Initializing batch generation..." });

        try {
            const csvText = await csvFile.text();
            const names = parseCSV(csvText);

            if (names.length === 0) {
                setStatusMessage({ type: 'error', text: "No valid data found in CSV." });
                setLoading(false);
                return;
            }

            setStatusMessage({ type: 'info', text: `Processing ${names.length} entries...` });

            const zip = new JSZip();
            let count = 0;

            for (const name of names) {
                const cleanName = name.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, '_');
                if (!cleanName || name.length < 2) continue;

                setStatusMessage({ type: 'info', text: `Rendering ${count + 1} of ${names.length}...` });

                const blob = await generateCertificate(name);

                if (blob) {
                    zip.file(`${cleanName}_${count + 1}.png`, blob);
                    count++;
                }
            }

            if (count === 0) {
                setStatusMessage({ type: 'error', text: "No certificates were generated." });
                setLoading(false);
                return;
            }

            setStatusMessage({ type: 'info', text: "Finalizing download..." });

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const zipUrl = window.URL.createObjectURL(zipBlob);

            const link = document.createElement('a');
            link.href = zipUrl;
            link.setAttribute('download', 'CertifyPro_Output.zip');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(zipUrl);

            setStatusMessage({ type: 'success', text: `Success! ${count} certificates ready.` });

        } catch (error) {
            console.error("Generation error:", error);
            setStatusMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setLoading(false);
        }
    }, [templateFile, csvFile, generateCertificate]);

    const handleTemplateChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (templateUrl) URL.revokeObjectURL(templateUrl);
            setTemplateFile(file);
            setTemplateUrl(URL.createObjectURL(file));
            setStatusMessage(null);
        }
    };

    const handleCSVChange = (e) => {
        setCsvFile(e.target.files[0]);
        setStatusMessage(null);
    };

    useEffect(() => {
        return () => {
            if (templateUrl) {
                URL.revokeObjectURL(templateUrl);
            }
            const existingLink = document.getElementById('current-google-font');
            if (existingLink) {
                document.head.removeChild(existingLink);
            }
        };
    }, [templateUrl]);

    const isReadyToGenerate = templateFile && csvFile && !loading;

    let statusClass = "bg-gray-50 text-gray-900 border-2 border-gray-300";
    let StatusIcon = null;
    if (statusMessage) {
        if (statusMessage.type === 'error') {
            statusClass = "bg-red-50 text-red-800 border-2 border-red-300";
            StatusIcon = X;
        } else if (statusMessage.type === 'success') {
            statusClass = "bg-green-50 text-green-800 border-2 border-green-300";
            StatusIcon = CheckCircle;
        } else if (statusMessage.type === 'info') {
            statusClass = "bg-blue-50 text-blue-800 border-2 border-blue-300";
            StatusIcon = Loader;
        }
    }

    return (
        <div className="min-h-screen flex font-sans bg-[#f5f1e8] text-slate-900 relative overflow-hidden">
            {/* Top Golden Accent Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a860] via-[#d4b76a] to-[#c9a860] z-50"></div>

            {/* Left Sidebar */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-lg relative z-10">
                
                {/* Header */}
                <div className="p-8 border-b border-gray-200 bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                CERTFY<span className="text-[#c9a860]">.ME</span>
                            </h1>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Certificate Generator</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Files Section */}
                    <div>
                        <h2 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">Input Files</h2>
                        
                        <div className="space-y-3">
                            {/* Template Upload */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Template</label>
                                <label htmlFor="template-upload" className="block w-full px-4 py-3 border-2 border-gray-300 bg-white hover:bg-gray-50 rounded-md hover:border-[#c9a860] transition-all duration-200 cursor-pointer">
                                    <div className="flex items-center justify-center gap-2 text-gray-700">
                                        <Upload size={16} />
                                        <span className="text-xs font-medium truncate">
                                            {templateFile ? templateFile.name : 'Upload template'}
                                        </span>
                                    </div>
                                </label>
                                <input id="template-upload" type="file" accept="image/*" onChange={handleTemplateChange} className="hidden" />
                            </div>

                            {/* CSV Upload */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">CSV with Names</label>
                                <label htmlFor="csv-upload" className="block w-full px-4 py-3 border-2 border-gray-300 bg-white hover:bg-gray-50 rounded-md hover:border-[#c9a860] transition-all duration-200 cursor-pointer">
                                    <div className="flex items-center justify-center gap-2 text-gray-700">
                                        <Upload size={16} />
                                        <span className="text-xs font-medium truncate">
                                            {csvFile ? csvFile.name : 'Upload CSV'}
                                        </span>
                                    </div>
                                </label>
                                <input id="csv-upload" type="file" accept=".csv" onChange={handleCSVChange} className="hidden" />
                            </div>
                        </div>
                    </div>

                    {/* Text Styling Section */}
                    <div>
                        <h2 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">Text Styling</h2>
                        
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                {/* Size */}
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Size</label>
                                    <input
                                        type="number"
                                        value={styles.fontSize}
                                        onChange={(e) => setStyles({...styles, fontSize: Number(e.target.value)})}
                                        className="w-full px-3 py-2 border-2 border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-[#c9a860] focus:border-[#c9a860] font-medium text-sm"
                                    />
                                </div>
                                {/* Color */}
                                <div className="w-20">
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Color</label>
                                    <div className="relative h-10 border-2 border-gray-300 bg-white rounded-md overflow-hidden cursor-pointer">
                                        <input
                                            type="color"
                                            value={styles.color}
                                            onChange={(e) => setStyles({...styles, color: e.target.value})}
                                            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                            style={{ padding: 0, border: 'none' }}
                                        />
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                            <span className="w-full h-full" style={{backgroundColor: styles.color}}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Font Category</label>
                                <div className="relative">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => {
                                            setSelectedCategory(e.target.value);
                                            setFontSearch('');
                                        }}
                                        className="w-full px-3 py-2 border-2 border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-[#c9a860] focus:border-[#c9a860] appearance-none font-medium text-sm"
                                    >
                                        {ALL_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Search Fonts */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">Search</label>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Font name..."
                                        value={fontSearch}
                                        onChange={(e) => setFontSearch(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-[#c9a860] focus:border-[#c9a860] font-medium text-sm placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Font List */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase flex justify-between">
                                    <span>Font Family</span>
                                    <span className="text-[#c9a860] font-bold">({filteredFonts.length})</span>
                                </label>
                                <div className="border-2 border-gray-300 rounded-md overflow-hidden bg-white max-h-48 overflow-y-auto">
                                    {filteredFonts.length === 0 ? (
                                        <div className="px-3 py-8 text-center text-gray-400 text-xs font-medium">No fonts found</div>
                                    ) : (
                                        filteredFonts.map(font => (
                                            <div
                                                key={font.family}
                                                onClick={() => setSelectedFont(font)}
                                                className={`px-3 py-2.5 cursor-pointer transition-all border-b border-gray-100 last:border-b-0 text-sm font-medium ${
                                                    selectedFont.family === font.family
                                                        ? 'bg-[#c9a860] text-white font-bold'
                                                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                                                }`}
                                                style={{
                                                    fontFamily: `"${font.family}"`,
                                                    fontWeight: font.variants.includes('700') ? 700 : 400
                                                }}
                                            >
                                                {font.family}
                                            </div>
                                        ))
                                    )}
                                </div>
                                <p className="mt-3 text-xs text-gray-600 font-medium">
                                    Active: <span
                                        className="font-bold text-[#c9a860]"
                                        style={{fontFamily: `"${selectedFont.family}"`}}
                                    >
                                        {selectedFont.family}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Action Area */}
                <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0 z-20">
                    {/* Status Message */}
                    {statusMessage && (
                        <div className={`flex items-start gap-3 p-3 text-xs mb-4 rounded-md border font-medium ${statusClass}`}>
                            {StatusIcon && <StatusIcon size={16} className={`shrink-0 mt-0.5 ${StatusIcon === Loader ? 'animate-spin' : ''}`} />}
                            <span className="break-words leading-relaxed">{statusMessage.text}</span>
                        </div>
                    )}

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !isReadyToGenerate}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-bold transition-all duration-200 uppercase tracking-wide text-sm ${
                            isReadyToGenerate
                                ? 'bg-[#c9a860] text-white hover:bg-[#b8964f] active:bg-[#a7874a] shadow-md hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader size={18} className="animate-spin" />
                                PROCESSING...
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                START GENERATION
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Right Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-8 relative z-0 bg-[#f5f1e8]" style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
            }}>
                {!templateUrl ? (
                    // Empty State
                    <div className="text-center max-w-md p-12 border-2 border-gray-300 rounded-lg bg-white shadow-lg">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-lg bg-[#c9a860] flex items-center justify-center border-2 border-gray-300">
                            <Upload size={36} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Ready to Begin</h3>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Upload your certificate template and CSV file to see a live preview. Drag text to position it.
                        </p>
                        <div className="inline-flex gap-4 text-xs font-semibold">
                            <span className={`flex items-center gap-2 px-3 py-2 rounded-md ${templateFile ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-gray-100 text-gray-500 border-2 border-gray-300'}`}>
                                {templateFile ? <CheckCircle size={14} /> : <X size={14} />}
                                Template
                            </span>
                            <span className={`flex items-center gap-2 px-3 py-2 rounded-md ${csvFile ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-gray-100 text-gray-500 border-2 border-gray-300'}`}>
                                {csvFile ? <CheckCircle size={14} /> : <X size={14} />}
                                CSV File
                            </span>
                        </div>
                    </div>
                ) : (
                    // Live Canvas
                    <div
                        ref={containerRef}
                        className="relative inline-block rounded-lg overflow-hidden bg-white border-2 border-gray-300 shadow-2xl"
                    >
                        <img
                            src={templateUrl}
                            alt="Certificate Template"
                            className="block max-h-[85vh] w-auto select-none pointer-events-none"
                            style={{ maxWidth: '100%' }}
                        />
                        <DragText
                            containerRef={containerRef}
                            onPositionChange={(x, y) => setDragPos({x, y})}
                            textStyles={styles}
                            fontFamily={`"${selectedFont.family}"`}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppMain;