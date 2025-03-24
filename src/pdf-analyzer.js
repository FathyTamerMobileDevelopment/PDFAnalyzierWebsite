import React, { useState } from 'react';

const PDFAnalyzer = () => {
  // State variables
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("arabic");
  const [analysisDepth, setAnalysisDepth] = useState("standard");
  
  // Get text based on selected language
  const getText = (arText, enText) => {
    return language === "arabic" ? arText : enText;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    } else {
      setFile(null);
      setFileName("");
      setError(getText("يرجى اختيار ملف بصيغة PDF", "Please select a PDF file"));
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFile(null);
    setFileName("");
    setResults(null);
    setError("");
    setActiveTab("summary");
  };

  // Analyze PDF file
  const analyzePDF = async () => {
    if (!file) {
      setError(getText("يرجى اختيار ملف أولاً", "Please select a file first"));
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, analysisDepth === "deep" ? 3500 : 2000));
      
      // Generate mock results based on file name and selected options
      const isAcademic = fileName.includes("thesis") || fileName.includes("research");
      const isTechnical = fileName.includes("manual") || fileName.includes("guide");
      const isFinancial = fileName.includes("financial") || fileName.includes("report");
      const isMathRelated = fileName.includes("math") || fileName.includes("phys");
      
      // Generate results based on language
      if (language === "english") {
        setResults({
          filename: fileName,
          pageCount: 12 + (analysisDepth === "deep" ? 8 : 0),
          summary: isAcademic 
            ? "This academic document focuses on research methodology and findings."
            : isTechnical
            ? "This technical document contains detailed specifications and implementation instructions."
            : "This document has been analyzed using advanced AI technology.",
          keyPoints: [
            {
              title: "Key Concepts",
              content: "The document presents several important concepts that form the foundation of the subject matter discussed."
            },
            {
              title: "Applications",
              content: "The document outlines several practical applications of the main concepts presented."
            }
          ],
          detailedExplanations: [
            {
              title: "Comprehensive Analysis",
              content: analysisDepth === "deep" 
                ? "This section provides an in-depth examination of the theoretical frameworks presented in the document."
                : "In this section, the AI model provides a detailed explanation of the main concepts."
            }
          ],
          equations: isMathRelated ? [
            {
              equation: "E = mc²",
              meaning: "Einstein's Mass-Energy Equivalence",
              explanation: "This equation expresses the concept that mass and energy are equivalent."
            }
          ] : [],
          problems: [
            {
              question: "Apply the main concept from the document to solve a practical problem.",
              solution: "To solve this problem, we would: 1) Identify the relevant principles, 2) Analyze how they apply, 3) Develop a structured approach."
            }
          ]
        });
      } else {
        setResults({
          filename: fileName,
          pageCount: 12 + (analysisDepth === "deep" ? 8 : 0),
          summary: isAcademic 
            ? "تركز هذه الوثيقة الأكاديمية على منهجية البحث والنتائج."
            : isTechnical
            ? "تحتوي هذه الوثيقة الفنية على مواصفات مفصلة وتعليمات التنفيذ."
            : "تم تحليل هذا المستند باستخدام تقنية الذكاء الاصطناعي المتقدمة.",
          keyPoints: [
            {
              title: "المفاهيم الرئيسية",
              content: "يقدم المستند العديد من المفاهيم المهمة التي تشكل أساس الموضوع الذي تمت مناقشته."
            },
            {
              title: "التطبيقات",
              content: "يحدد المستند العديد من التطبيقات العملية للمفاهيم الرئيسية المقدمة."
            }
          ],
          detailedExplanations: [
            {
              title: "تحليل شامل",
              content: analysisDepth === "deep" 
                ? "يقدم هذا القسم فحصًا متعمقًا للأطر النظرية المقدمة في المستند."
                : "في هذا القسم، يقدم نموذج الذكاء الاصطناعي شرحًا مفصلاً للمفاهيم الرئيسية."
            }
          ],
          equations: isMathRelated ? [
            {
              equation: "E = mc²",
              meaning: "معادلة أينشتاين لتكافؤ الكتلة والطاقة",
              explanation: "تعبر هذه المعادلة عن مفهوم أن الكتلة والطاقة متكافئتان."
            }
          ] : [],
          problems: [
            {
              question: "طبق المفهوم الرئيسي من المستند لحل مشكلة عملية.",
              solution: "لحل هذه المشكلة، سنقوم بما يلي: 1) تحديد المبادئ ذات الصلة، 2) تحليل كيفية تطبيقها، 3) تطوير نهج منظم."
            }
          ]
        });
      }
    } catch (err) {
      setError(getText(`حدث خطأ أثناء تحليل الملف: ${err.message}`, `Error analyzing file: ${err.message}`));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Render UI
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6" style={{direction: language === "arabic" ? "rtl" : "ltr"}}>
      {/* Language Selector */}
      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button 
            onClick={() => setLanguage("arabic")} 
            className={`px-3 py-1 rounded ${language === "arabic" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            العربية
          </button>
          <button 
            onClick={() => setLanguage("english")} 
            className={`px-3 py-1 rounded ${language === "english" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            English
          </button>
        </div>
      </div>
      
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6">
        {getText("محلل PDF ذكي", "Intelligent PDF Analyzer")}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        {getText(
          "قم برفع ملف PDF وسيقوم الذكاء الاصطناعي بتحليل محتواه وتقديم شرح مفصل",
          "Upload a PDF file and AI will analyze its content, providing detailed explanations"
        )}
      </p>
      
      {/* Analysis Depth Selector */}
      <div className="w-full flex space-x-4 rtl:space-x-reverse mb-6">
        <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">
            {getText("عمق التحليل", "Analysis Depth")}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setAnalysisDepth("standard")}
              className={`flex-1 py-2 px-3 rounded text-sm ${analysisDepth === "standard" ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'}`}
            >
              {getText("قياسي", "Standard")}
            </button>
            <button
              onClick={() => setAnalysisDepth("deep")}
              className={`flex-1 py-2 px-3 rounded text-sm ${analysisDepth === "deep" ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'}`}
            >
              {getText("عميق", "Deep")}
            </button>
          </div>
        </div>
      </div>
      
      {/* File Upload Area */}
      <div className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg mb-6 text-center">
        {fileName ? (
          <div className="flex flex-col items-center">
            <p className="mb-2 text-lg">
              {getText(`الملف المختار: ${fileName}`, `Selected file: ${fileName}`)}
            </p>
            <button 
              onClick={resetForm}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              {getText("حذف الملف", "Remove File")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mb-4">
              {getText("اسحب ملف PDF هنا أو اضغط لاختيار ملف", "Drag a PDF file here or click to select a file")}
            </p>
            <label className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
              {getText("اختيار ملف PDF", "Select PDF File")}
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                className="hidden" 
              />
            </label>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Analyze Button */}
      <button 
        onClick={analyzePDF}
        disabled={!file || isAnalyzing}
        className={`px-6 py-3 text-lg rounded-md text-white mb-6 w-full sm:w-64 
          ${!file || isAnalyzing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 transition-colors'}`}
      >
        {isAnalyzing 
          ? getText('جاري التحليل...', 'Analyzing...') 
          : getText('تحليل المستند باستخدام الذكاء الاصطناعي', 'Analyze Document with AI')}
      </button>
      
      {/* Loading Indicator */}
      {isAnalyzing && (
        <div className="flex flex-col justify-center items-center mb-6">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">
            {getText(
              "جاري تحليل المستند باستخدام الذكاء الاصطناعي...",
              "Analyzing document using AI..."
            )}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {getText(
              "قد تستغرق العملية بضع دقائق حسب حجم وتعقيد المستند",
              "This process may take a few minutes depending on document size and complexity"
            )}
          </p>
        </div>
      )}
      
      {/* Results Section */}
      {results && (
        <div className="w-full mb-6 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Results Header */}
          <div className="bg-blue-50 p-4 border-b">
            <h2 className="text-xl font-bold">
              {getText(`تحليل: ${results.filename}`, `Analysis: ${results.filename}`)}
            </h2>
            <p className="text-sm text-gray-600">
              {getText(`عدد الصفحات: ${results.pageCount}`, `Pages: ${results.pageCount}`)}
            </p>
            {analysisDepth === "deep" && (
              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {getText("تحليل عميق", "Deep Analysis")}
              </span>
            )}
          </div>
          
          {/* Results Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
            <button
              className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'summary' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600'}`}
              onClick={() => setActiveTab('summary')}
            >
              {getText("الملخص", "Summary")}
            </button>
            <button
              className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'keyPoints' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600'}`}
              onClick={() => setActiveTab('keyPoints')}
            >
              {getText("النقاط الرئيسية", "Key Points")}
            </button>
            <button
              className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'detailed' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600'}`}
              onClick={() => setActiveTab('detailed')}
            >
              {getText("شرح مفصل", "Detailed Explanation")}
            </button>
            {results.equations && results.equations.length > 0 && (
              <button
                className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'equations' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600'}`}
                onClick={() => setActiveTab('equations')}
              >
                {getText("المعادلات", "Equations")}
              </button>
            )}
            {results.problems && results.problems.length > 0 && (
              <button
                className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'problems' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600'}`}
                onClick={() => setActiveTab('problems')}
              >
                {getText("المسائل المحلولة", "Solved Problems")}
              </button>
            )}
          </div>
          
          {/* Results Content */}
          <div className="p-6">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div>
                <h3 className="text-lg font-bold mb-3">
                  {getText("ملخص المستند:", "Document Summary:")}
                </h3>
                <p className="p-4 bg-gray-50 rounded-lg border border-gray-200">{results.summary}</p>
              </div>
            )}
            
            {/* Key Points Tab */}
            {activeTab === 'keyPoints' && (
              <div>
                <h3 className="text-lg font-bold mb-3">
                  {getText("النقاط الرئيسية:", "Key Points:")}
                </h3>
                <div className="space-y-4">
                  {results.keyPoints.map((point, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-blue-700 mb-1">{point.title}</h4>
                      <p>{point.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Detailed Explanation Tab */}
            {activeTab === 'detailed' && (
              <div>
                <h3 className="text-lg font-bold mb-3">
                  {getText("شرح مفصل:", "Detailed Explanation:")}
                </h3>
                <div className="space-y-4">
                  {results.detailedExplanations.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-blue-700 mb-2">{item.title}</h4>
                      <p className="whitespace-pre-line">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Equations Tab */}
            {activeTab === 'equations' && results.equations && results.equations.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">
                  {getText("المعادلات:", "Equations:")}
                </h3>
                <div className="space-y-4">
                  {results.equations.map((eq, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-center p-3 mb-3 bg-white rounded border border-gray-200">
                        <p className="text-lg font-mono font-bold text-center">{eq.equation}</p>
                      </div>
                      <h4 className="font-bold text-blue-700 mb-1">{eq.meaning}</h4>
                      <p>{eq.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Problems Tab */}
            {activeTab === 'problems' && results.problems && results.problems.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">
                  {getText("المسائل المحلولة:", "Solved Problems:")}
                </h3>
                <div className="space-y-4">
                  {results.problems.map((problem, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-700 mb-2">
                        {getText(`المسألة ${index+1}:`, `Problem ${index+1}:`)}
                      </h4>
                      <p className="mb-4 p-3 bg-white rounded border border-gray-200">{problem.question}</p>
                      <h5 className="font-bold mb-2">
                        {getText("الحل:", "Solution:")}
                      </h5>
                      <p className="whitespace-pre-line p-3 bg-white rounded border border-gray-200">{problem.solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Footer Note */}
            <div className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-600">
             
            </div>
          </div>
        </div>
      )}
      
      {/* API Integration Note */}
      {!results && !isAnalyzing && (
        <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 mt-8">
          <h3 className="text-lg font-bold mb-2">
            {getText("ملاحظة حول التكامل مع API", "Note about API Integration")}
          </h3>
          <p className="text-gray-700">
            {getText(
              "يمكن تكامل هذا التطبيق مع أي واجهة برمجة تطبيقات (API) للذكاء الاصطناعي مثل OpenAI أو Claude أو غيرها للحصول على تحليل حقيقي لملفات PDF.",
              "This application can be integrated with any AI API such as OpenAI, Claude, or others to get real analysis of PDF files."
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFAnalyzer;
