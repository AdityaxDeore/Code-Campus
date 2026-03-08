# Jedi Archives Sentinel
## National Academic Integrity Intelligence Network

---

## What is Jedi Archives Sentinel?

**Jedi Archives Sentinel** is an intelligent, multi-modal academic integrity intelligence network designed to detect various forms of academic dishonesty in educational institutions. It is an integral component of the **CodeCampus** platform—a comprehensive academic coding education platform for computer science university students.

The system represents a paradigm shift in academic integrity monitoring, moving beyond simple plagiarism detection to address sophisticated modern cheating methods including:

- **AI-generated content** - Essays and assignments written by AI tools (ChatGPT, Gemini, Claude, etc.)
- **Online proctoring violations** - Answer sharing during online exams
- **Cross-institutional cheating** - Collaboration on individual assignments across different institutions
- **Advanced plagiarism** - Modernized forms of content copying

---

## Our Mission / Motto

> *"Preserving Academic Truth in the Age of Artificial Intelligence"*

We believe that academic credentials should represent genuine knowledge and skills. Our mission is to:

1. **Protect the value of educational credentials** by ensuring academic integrity
2. **Empower educators** with intelligent, actionable evidence
3. **Preserve student privacy** while maintaining rigorous integrity standards
4. **Scale nationally** to support institutions of all sizes

---

## How We Are Solving Problem Statement 1 [PS1]

### The Problem

Academic dishonesty has evolved beyond simple copying. Students now use AI to generate essays indistinguishable from human writing, share answers during online proctored exams, and collaborate on individual assignments across institutions. Educational institutions lack the tools to detect these sophisticated forms of cheating at scale, undermining the credibility of degrees and certifications.

### Our Solution: Multi-Layer AI Detection System

The Jedi Archives Sentinel implements a **three-layer detection architecture**:

#### Layer 1: Heuristic Analysis
Pattern-based local checks that analyze:
- **Text/Report Analysis**: AI-typical transition phrases, sentence uniformity, formatting patterns, formal tone markers
- **Code Analysis**: Comment ratios, indentation patterns, variable naming conventions, error handling patterns, docstring usage

#### Layer 2: Behavioral Analysis
Integrity monitoring that tracks:
- Paste event patterns and suspicious paste flags
- Focus loss events (copying from external sources)
- AI assistant usage frequency
- Typing patterns (keystroke analysis)
- Tab switching behavior
- DevTools detection

#### Layer 3: Gemini-Powered LLM Analysis
Deep content analysis using Google's Gemini API to:
- Evaluate writing style consistency
- Detect AI-specific vocabulary and patterns
- Provide probabilistic assessment with confidence levels
- Generate explainable reasoning for educators

### Key Features

1. **Real-time Processing**: Submissions analyzed in < 10 seconds per document
2. **Explainable Results**: Detailed breakdown of detection signals with evidence
3. **Multi-modal Detection**: Handles text, code, essays, and reports
4. **Privacy-Preserving**: Student data handled with strict privacy protocols
5. **Institutional Scaling**: Designed to scale from individual courses to national networks

---

## Why It Matters

### The Statistics

- **1.68% of students** admit to cheating (International Center for Academic Integrity)
- **AI-written essays** are increasingly undetectable by current tools
- **Cross-institutional cheating** leaves no trace in isolated systems
- **Academic credentials lose value** when integrity cannot be verified

### The Impact

By ensuring academic integrity, we:
- Preserve the value of legitimate degrees and certifications
- Maintain fairness for honest students
- Support educators with evidence-based insights
- Uphold the reputation of educational institutions

---

## Success Metrics

Our system is considered successful when we achieve:

| Metric | Target |
|--------|--------|
| **Detection Accuracy** | 85%+ across multiple modalities |
| **Processing Speed** | < 10 seconds per document |
| **Result Explainability** | Clear evidence for educators |
| **Scalability** | Institutional and national levels |

---

## Secondary SDGs Alignment

Jedi Archives Sentinel contributes to the following United Nations Sustainable Development Goals:

### SDG 10 - Reduced Inequalities

- **Leveling the playing field** for honest students who compete with those who cheat
- **Ensuring fair assessment** regardless of a student's background or access to AI tools
- **Maintaining credential integrity** that impacts employment opportunities disproportionately

### SDG 16 - Peace, Justice and Strong Institutions

- **Promoting transparent educational practices**
- **Supporting institutions** in maintaining academic standards
- **Building trust** in educational credentialing systems
- **Strengthening institutional integrity** through evidence-based monitoring

---

## CodeCampus Integration

Jedi Archives Sentinel is fully integrated into the CodeCampus platform, providing:

### For Students
- **Real-time integrity feedback** during assignments
- **AI assistance** that helps without compromising learning
- **Fair assessment** environment that rewards genuine effort

### For Educators
- **Comprehensive integrity reports** with detailed evidence
- **Automated detection** across multiple modalities
- **Actionable insights** for academic decisions

### For Institutions
- **Scalable deployment** from single courses to entire campuses
- **Cross-institutional matching** capabilities
- **Privacy-compliant** data handling

---

## Technical Implementation

The detection system is implemented in `src/lib/aiDetection.js` and provides:

```javascript
// Core detection function
detectAiGenerated(code, language, integrityReport)
```

**Returns:**
- `score`: 0-100 probability of AI generation
- `verdict`: Human-written / Possibly AI-assisted / Likely AI-assisted / Highly likely AI-generated
- `riskLevel`: low / medium / high / critical
- `breakdown`: Detailed analysis from all three layers
- `allSignals`: Comprehensive list of detection indicators

---

## Future Vision

As AI continues to evolve, Jedi Archives Sentinel will:

1. **Advance detection algorithms** to counter new AI generation techniques
2. **Expand cross-institutional networks** for nationwide academic integrity
3. **Integrate additional modalities** (audio, video submissions)
4. **Develop predictive analytics** for at-risk students
5. **Partner with educational institutions** worldwide

---

*Jedi Archives Sentinel: Protecting Academic Truth in the Digital Age*

