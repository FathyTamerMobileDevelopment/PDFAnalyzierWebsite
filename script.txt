// Global state variables
let language = 'arabic';
let analysisDepth = 'standard';
let file = null;
let fileName = '';
let isAnalyzing = false;
let results = null;
let activeTab = 'summary';

// Text translations
const translations = {
  arabic: {
    pageTitle: 'محلل PDF ذكي',
    pageSubtitle: 'قم برفع ملف PDF وسيقوم الذكاء الاصطناعي بتحليل محتواه وتقديم شرح مفصل',
    depthTitle: 'عمق التحليل',
    standardDepth: 'قياسي',
    deepDepth: 'عميق',
    dragText: 'اسحب ملف PDF هنا أو اضغط لاختيار ملف',
    selectFileText: 'اختيار ملف PDF',
    selectedFilePrefix: 'الملف المختار:',
    removeFile: 'حذف الملف',
    analyzeButton: 'تحليل المستند باستخدام الذكاء الاصطناعي',
    analyzingText: 'جاري التحليل...',
    analyzingSubtitle: 'قد تستغرق العملية بضع دقائق حسب حجم وتعقيد المستند',
    analyzingDeepNotice: 'تم اختيار التحليل العميق، قد يستغرق ذلك وقتًا إضافيًا',
    analysisPrefix: 'تحليل:',
    pagesPrefix: 'عدد الصفحات:',
    deepAnalysisBadge: 'تحليل عميق',
    tabSummary: 'الملخص',
    tabKeyPoints: 'النقاط الرئيسية',
    tabDetailed: 'شرح مفصل',
    tabEquations: 'المعادلات',
    tabProblems: 'المسائل المحلولة',
    summaryTitle: 'ملخص المستند:',
    keyPointsTitle: 'النقاط الرئيسية:',
    detailedTitle: 'شرح مفصل:',
    equationsTitle: 'المعادلات:',
    problemsTitle: 'المسائل المحلولة:',
    problemLabel: 'المسألة',
    solutionLabel: 'الحل:',
    footerNote: 'ملاحظة: في التطبيق الحقيقي، سيتم استخدام نماذج الذكاء الاصطناعي المتقدمة مثل GPT-4 أو Claude لتحليل محتوى ملفات PDF واستخراج المعلومات المهمة.',
    apiNoteTitle: 'ملاحظة حول التكامل مع API',
    apiNoteContent: 'يمكن تكامل هذا التطبيق مع أي واجهة برمجة تطبيقات (API) للذكاء الاصطناعي مثل OpenAI أو Claude أو غيرها للحصول على تحليل حقيقي لملفات PDF.',
    errorSelectFile: 'يرجى اختيار ملف أولاً',
    errorInvalidFile: 'يرجى اختيار ملف بصيغة PDF',
    errorAnalysis: 'حدث خطأ أثناء تحليل الملف:',
  },
  english: {
    pageTitle: 'Intelligent PDF Analyzer',
    pageSubtitle: 'Upload a PDF file and AI will analyze its content, providing detailed explanations',
    depthTitle: 'Analysis Depth',
    standardDepth: 'Standard',
    deepDepth: 'Deep',
    dragText: 'Drag a PDF file here or click to select a file',
    selectFileText: 'Select PDF File',
    selectedFilePrefix: 'Selected file:',
    removeFile: 'Remove File',
    analyzeButton: 'Analyze Document with AI',
    analyzingText: 'Analyzing...',
    analyzingSubtitle: 'This process may take a few minutes depending on document size and complexity',
    analyzingDeepNotice: 'Deep analysis selected, this may take additional time',
    analysisPrefix: 'Analysis:',
    pagesPrefix: 'Pages:',
    deepAnalysisBadge: 'Deep Analysis',
    tabSummary: 'Summary',
    tabKeyPoints: 'Key Points',
    tabDetailed: 'Detailed Explanation',
    tabEquations: 'Equations',
    tabProblems: 'Solved Problems',
    summaryTitle: 'Document Summary:',
    keyPointsTitle: 'Key Points:',
    detailedTitle: 'Detailed Explanation:',
    equationsTitle: 'Equations:',
    problemsTitle: 'Solved Problems:',
    problemLabel: 'Problem',
    solutionLabel: 'Solution:',
    footerNote: 'Note: In a real application, advanced AI models like GPT-4 or Claude would be used to analyze PDF content and extract important information.',
    apiNoteTitle: 'Note about API Integration',
    apiNoteContent: 'This application can be integrated with any AI API such as OpenAI, Claude, or others to get real analysis of PDF files.',
    errorSelectFile: 'Please select a file first',
    errorInvalidFile: 'Please select a PDF file',
    errorAnalysis: 'Error analyzing file:',
  }
};

// DOM references
const appContainer = document.getElementById('app');
const fileInput = document.getElementById('file-input');
const fileSelectionEmpty = document.getElementById('file-selection-empty');
const fileSelectionFilled = document.getElementById('file-selection-filled');
const selectedFilename = document.getElementById('selected-filename');
const btnRemoveFile = document.getElementById('btn-remove-file');
const btnAnalyze = document.getElementById('btn-analyze');
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading-indicator');
const analyzingDeepNotice = document.getElementById('analyzing-deep-notice');
const resultsContainer = document.getElementById('results-container');
const resultFilename = document.getElementById('result-filename');
const resultPagecount = document.getElementById('result-pagecount');
const deepAnalysisBadge = document.getElementById('deep-analysis-badge');
const apiNote = document.getElementById('api-note');

// Initialize the UI
function initializeUI() {
  // Set up event listeners
  document.getElementById('btn-arabic').addEventListener('click', () => setLanguage('arabic'));
  document.getElementById('btn-english').addEventListener('click', () => setLanguage('english'));
  document.getElementById('btn-standard').addEventListener('click', () => setAnalysisDepth('standard'));
  document.getElementById('btn-deep').addEventListener('click', () => setAnalysisDepth('deep'));
  fileInput.addEventListener('change', handleFileChange);
  btnRemoveFile.addEventListener('click', resetForm);
  btnAnalyze.addEventListener('click', analyzePDF);
  
  // Set up tab click handlers
  document.querySelectorAll('#results-tabs button').forEach(tab => {
    tab.addEventListener('click', handleTabClick);
  });
  
  // Apply initial language
  updateUIText();
}

// Set language
function setLanguage(newLanguage) {
  language = newLanguage;
  appContainer.setAttribute('dir', language === 'arabic' ? 'rtl' : 'ltr');
  document.getElementById('btn-arabic').className = `px-3 py-1 rounded ${language === 'arabic' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`;
  document.getElementById('btn-english').className = `px-3 py-1 rounded ${language === 'english' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`;
  
  // Update all text elements
  updateUIText();
}

// Set analysis depth
function setAnalysisDepth(newDepth) {
  analysisDepth = newDepth;
  document.getElementById('btn-standard').className = `flex-1 py-2 px-3 rounded text-sm ${analysisDepth === 'standard' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'}`;
  document.getElementById('btn-deep').className = `flex-1 py-2 px-3 rounded text-sm ${analysisDepth === 'deep' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'}`;
  
  // Update text that might depend on analysis depth
  updateUIText();
}

// Handle file selection
function handleFileChange(event) {
  const selectedFile = event.target.files[0];
  if (selectedFile && selectedFile.type === "application/pdf") {
    file = selectedFile;
    fileName = selectedFile.name;
    selectedFilename.textContent = fileName;
    
    // Show/hide appropriate elements
    fileSelectionEmpty.classList.add('hidden');
    fileSelectionFilled.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    btnAnalyze.disabled = false;
    btnAnalyze.classList.remove('bg-gray-400', 'cursor-not-allowed');
    btnAnalyze.classList.add('bg-green-600', 'hover:bg-green-700', 'transition-colors');
  } else {
    file = null;
    fileName = "";
    
    // Show error
    showError(translations[language].errorInvalidFile);
  }
}

// Reset form
function resetForm() {
  file = null;
  fileName = "";
  results = null;
  activeTab = 'summary';
  
  // Reset file input
  fileInput.value = "";
  
  // Update UI
  fileSelectionEmpty.classList.remove('hidden');
  fileSelectionFilled.classList.add('hidden');
  errorMessage.classList.add('hidden');
  resultsContainer.classList.add('hidden');
  apiNote.classList.remove('hidden');
  
  // Disable analyze button
  btnAnalyze.disabled = true;
  btnAnalyze.classList.add('bg-gray-400', 'cursor-not-allowed');
  btnAnalyze.classList.remove('bg-green-600', 'hover:bg-green-700', 'transition-colors');
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

// Handle tab click
function handleTabClick(event) {
  const tabId = event.target.getAttribute('data-tab');
  setActiveTab(tabId);
}

// Set active tab
function setActiveTab(tabId) {
  activeTab = tabId;
  
  // Update tab button styles
  document.querySelectorAll('#results-tabs button').forEach(tab => {
    const isActive = tab.getAttribute('data-tab') === activeTab;
    tab.className = `py-2 px-4 font-medium whitespace-nowrap ${isActive ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600'}`;
  });
  
  // Show active tab content, hide others
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === `tab-content-${activeTab}`) {
      content.classList.remove('hidden');
    } else {
      content.classList.add('hidden');
    }
  });
}

// Analyze PDF
async function analyzePDF() {
  if (!file) {
    showError(translations[language].errorSelectFile);
    return;
  }
  
  isAnalyzing = true;
  errorMessage.classList.add('hidden');
  btnAnalyze.disabled = true;
  btnAnalyze.textContent = translations[language].analyzingText;
  btnAnalyze.classList.add('bg-gray-400', 'cursor-not-allowed');
  btnAnalyze.classList.remove('bg-green-600', 'hover:bg-green-700', 'transition-colors');
  loadingIndicator.classList.remove('hidden');
  apiNote.classList.add('hidden');
  
  // Show deep analysis notice if applicable
  if (analysisDepth === 'deep') {
    analyzingDeepNotice.classList.remove('hidden');
  } else {
    analyzingDeepNotice.classList.add('hidden');
  }
  
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, analysisDepth === 'deep' ? 3500 : 2000));
    
    // Generate mock results based on file name and selected options
    const isAcademic = fileName.includes('thesis') || fileName.includes('research');
    const isTechnical = fileName.includes('manual') || fileName.includes('guide');
    const isFinancial = fileName.includes('financial') || fileName.includes('report');
    const isMathRelated = fileName.includes('math') || fileName.includes('phys');
    
    // Generate results object based on language
    if (language === 'english') {
      results = {
        filename: fileName,
        pageCount: 12 + (analysisDepth === 'deep' ? 8 : 0),
        summary: isAcademic 
          ? 'This academic document focuses on research methodology and findings.'
          : isTechnical
          ? 'This technical document contains detailed specifications and implementation instructions.'
          : 'This document has been analyzed using advanced AI technology.',
        keyPoints: [
          {
            title: 'Key Concepts',
            content: 'The document presents several important concepts that form the foundation of the subject matter discussed.'
          },
          {
            title: 'Applications',
            content: 'The document outlines several practical applications of the main concepts presented.'
          }
        ],
        detailedExplanations: [
          {
            title: 'Comprehensive Analysis',
            content: analysisDepth === 'deep' 
              ? 'This section provides an in-depth examination of the theoretical frameworks presented in the document.'
              : 'In this section, the AI model provides a detailed explanation of the main concepts.'
          }
        ],
        equations: isMathRelated ? [
          {
            equation: 'E = mc²',
            meaning: 'Einstein\'s Mass-Energy Equivalence',
            explanation: 'This equation expresses the concept that mass and energy are equivalent.'
          }
        ] : [],
        problems: [
          {
            question: 'Apply the main concept from the document to solve a practical problem.',
            solution: 'To solve this problem, we would: 1) Identify the relevant principles, 2) Analyze how they apply, 3) Develop a structured approach.'
          }
        ]
      };
    } else {
      results = {
        filename: fileName,
        pageCount: 12 + (analysisDepth === 'deep' ? 8 : 0),
        summary: isAcademic 
          ? 'تركز هذه الوثيقة الأكاديمية على منهجية البحث والنتائج.'
          : isTechnical
          ? 'تحتوي هذه الوثيقة الفنية على مواصفات مفصلة وتعليمات التنفيذ.'
          : 'تم تحليل هذا المستند باستخدام تقنية الذكاء الاصطناعي المتقدمة.',
        keyPoints: [
          {
            title: 'المفاهيم الرئيسية',
            content: 'يقدم المستند العديد من المفاهيم المهمة التي تشكل أساس الموضوع الذي تمت مناقشته.'
          },
          {
            title: 'التطبيقات',
            content: 'يحدد المستند العديد من التطبيقات العملية للمفاهيم الرئيسية المقدمة.'
          }
        ],
        detailedExplanations: [
          {
            title: 'تحليل شامل',
            content: analysisDepth === 'deep' 
              ? 'يقدم هذا القسم فحصًا متعمقًا للأطر النظرية المقدمة في المستند.'
              : 'في هذا القسم، يقدم نموذج الذكاء الاصطناعي شرحًا مفصلاً للمفاهيم الرئيسية.'
          }
        ],
        equations: isMathRelated ? [
          {
            equation: 'E = mc²',
            meaning: 'معادلة أينشتاين لتكافؤ الكتلة والطاقة',
            explanation: 'تعبر هذه المعادلة عن مفهوم أن الكتلة والطاقة متكافئتان.'
          }
        ] : [],
        problems: [
          {
            question: 'طبق المفهوم الرئيسي من المستند لحل مشكلة عملية.',
            solution: 'لحل هذه المشكلة، سنقوم بما يلي: 1) تحديد المبادئ ذات الصلة، 2) تحليل كيفية تطبيقها، 3) تطوير نهج منظم.'
          }
        ]
      };
    }
    
    // Display results
    displayResults();
    
  } catch (err) {
    showError(`${translations[language].errorAnalysis} ${err.message}`);
  } finally {
    isAnalyzing = false;
    loadingIndicator.classList.add('hidden');
    btnAnalyze.disabled = false;
    btnAnalyze.textContent = translations[language].analyzeButton;
    btnAnalyze.classList.remove('bg-gray-400', 'cursor-not-allowed');
    btnAnalyze.classList.add('bg-green-600', 'hover:bg-green-700', 'transition-colors');
  }
}

// Display results
function displayResults() {
  if (!results) return;
  
  // Update results header
  resultFilename.textContent = results.filename;
  resultPagecount.textContent = results.pageCount;
  
  // Show/hide deep analysis badge
  if (analysisDepth === 'deep') {
    deepAnalysisBadge.classList.remove('hidden');
  } else {
    deepAnalysisBadge.classList.add('hidden');
  }
  
  // Update tab visibility based on available data
  document.getElementById('tab-equations').classList.toggle('hidden', !results.equations || results.equations.length === 0);
  
  // Update summary content
  document.getElementById('summary-content').textContent = results.summary;
  
  // Update key points
  const keyPointsContainer = document.getElementById('keypoints-container');
  keyPointsContainer.innerHTML = '';
  results.keyPoints.forEach(point => {
    const pointElement = document.createElement('div');
    pointElement.className = 'p-4 bg-gray-50 rounded-lg border border-gray-200';
    pointElement.innerHTML = `
      <h4 class="font-bold text-blue-700 mb-1">${point.title}</h4>
      <p>${point.content}</p>
    `;
    keyPointsContainer.appendChild(pointElement);
  });
  
  // Update detailed explanations
  const detailedContainer = document.getElementById('detailed-container');
  detailedContainer.innerHTML = '';
  results.detailedExplanations.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'p-4 bg-gray-50 rounded-lg border border-gray-200';
    itemElement.innerHTML = `
      <h4 class="font-bold text-blue-700 mb-2">${item.title}</h4>
      <p class="whitespace-pre-line">${item.content}</p>
    `;
    detailedContainer.appendChild(itemElement);
  });
  
  // Update equations if present
  if (results.equations && results.equations.length > 0) {
    const equationsContainer = document.getElementById('equations-container');
    equationsContainer.innerHTML = '';
    results.equations.forEach(eq => {
      const eqElement = document.createElement('div');
      eqElement.className = 'p-4 bg-blue-50 rounded-lg border border-blue-200';
      eqElement.innerHTML = `
        <div class="flex items-center justify-center p-3 mb-3 bg-white rounded border border-gray-200">
          <p class="text-lg font-mono font-bold text-center">${eq.equation}</p>
        </div>
        <h4 class="font-bold text-blue-700 mb-1">${eq.meaning}</h4>
        <p>${eq.explanation}</p>
      `;
      equationsContainer.appendChild(eqElement);
    });
  }
  
  // Update problems
  const problemsContainer = document.getElementById('problems-container');
  problemsContainer.innerHTML = '';
  results.problems.forEach((problem, index) => {
    const problemElement = document.createElement('div');
    problemElement.className = 'p-4 bg-green-50 rounded-lg border border-green-200';
    problemElement.innerHTML = `
      <h4 class="font-bold text-green-700 mb-2">
        ${translations[language].problemLabel} ${index+1}:
      </h4>
      <p class="mb-4 p-3 bg-white rounded border border-gray-200">${problem.question}</p>
      <h5 class="font-bold mb-2">
        ${translations[language].solutionLabel}
      </h5>
      <p class="whitespace-pre-line p-3 bg-white rounded border border-gray-200">${problem.solution}</p>
    `;
    problemsContainer.appendChild(problemElement);
  });
  
  // Show results container
  resultsContainer.classList.remove('hidden');
  
  // Set active tab
  setActiveTab('summary');
}

// Update all UI text elements based on current language
function updateUIText() {
  const text = translations[language];
  
  document.getElementById('page-title').textContent = text.pageTitle;
  document.getElementById('page-subtitle').textContent = text.pageSubtitle;
  document.getElementById('depth-title').textContent = text.depthTitle;
  document.getElementById('btn-standard').textContent = text.standardDepth;
  document.getElementById('btn-deep').textContent = text.deepDepth;
  document.getElementById('drag-text').textContent = text.dragText;
  document.getElementById('select-file-text').textContent = text.selectFileText;
  document.getElementById('selected-file-prefix').textContent = text.selectedFilePrefix;
  document.getElementById('btn-remove-file').textContent = text.removeFile;
  document.getElementById('btn-analyze').textContent = isAnalyzing ? text.analyzingText : text.analyzeButton;
  document.getElementById('analyzing-text').textContent = text.analyzingText;
  document.getElementById('analyzing-subtitle').textContent = text.analyzingSubtitle;
  document.getElementById('analyzing-deep-notice').textContent = text.analyzingDeepNotice;
  document.getElementById('analysis-prefix').textContent = text.analysisPrefix;
  document.getElementById('pages-prefix').textContent = text.pagesPrefix;
  document.getElementById('deep-analysis-badge').textContent = text.deepAnalysisBadge;
  document.getElementById('tab-summary').textContent = text.tabSummary;
  document.getElementById('tab-keyPoints').textContent = text.tabKeyPoints;
  document.getElementById('tab-detailed').textContent = text.tabDetailed;
  document.getElementById('tab-equations').textContent = text.tabEquations;
  document.getElementById('tab-problems').textContent = text.tabProblems;
  document.getElementById('summary-title').textContent = text.summaryTitle;
  document.getElementById('keypoints-title').textContent = text.keyPointsTitle;
  document.getElementById('detailed-title').textContent = text.detailedTitle;
  document.getElementById('equations-title').textContent = text.equationsTitle;
  document.getElementById('problems-title').textContent = text.problemsTitle;
  document.getElementById('footer-note').textContent = text.footerNote;
  document.getElementById('api-note-title').textContent = text.apiNoteTitle;
  document.getElementById('api-note-content').textContent = text.apiNoteContent;
  
  // Update results if they exist
  if (results) {
    displayResults();
  }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeUI);
