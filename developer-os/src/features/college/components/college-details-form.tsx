"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  ChevronDown,
  Check,
  Sparkles,
  Settings,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollegeDetails } from "../types";

interface CollegeDetailsFormProps {
  details: CollegeDetails | null;
  onSave: (details: CollegeDetails) => void;
  onFetchSyllabus: () => void;
  isFetching: boolean;
}

const universities = [
  // AKTU (Abdul Kalam Technical University)
  "Abdul Kalam Technical University (AKTU, Lucknow)",
  // State Technical Universities - Uttar Pradesh
  "Harcourt Butler Technical University (HBTU, Kanpur)",
  "Chaudhary Charan Singh University (CCS, Meerut)",
  "Dr. Bhimrao Ambedkar University (DBRAU, Agra)",
  "Deen Dayal Upadhyaya Gorakhpur University (DDU)",
  "Mahatma Jyotiba Phule Rohilkhand University (MJPRU)",
  "Dr. Ram Manohar Lohia Avadh University (RMLAU)",
  "Veer Kunwar Singh University (VKSU)",
  "Bundlekhand University",
  "Integral University, Lucknow",
  "Institute of Engineering & Technology, Lucknow (IET Lucknow)",
  "GLA University, Mathura",
  "Shobhit University, Meerut",
  "IIMT University, Meerut",
  "Subharti University, Meerut",
  // State Technical Universities - Madhya Pradesh
  "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV, Bhopal)",
  "Barkatullah University, Bhopal",
  "Jiwaji University, Gwalior",
  // State Technical Universities - Chhattisgarh
  "Chhattisgarh Swami Vivekanand Technical University (CSVTU)",
  "Pt. Ravishankar Shukla University (PRSU, Raipur)",
  // State Technical Universities - Rajasthan
  "Rajasthan Technical University (RTU, Kota)",
  "University of Rajasthan, Jaipur",
  "Jai Narain Vyas University, Jodhpur",
  "Maharana Pratap University of Agriculture & Technology",
  // State Technical Universities - Maharashtra
  "Savitribai Phule Pune University (SPPU)",
  "University of Mumbai",
  "Dr. Babasaheb Ambedkar Marathwada University (BAMU)",
  "Sant Gadge Baba Amravati University",
  "Rashtrasant Tukadoji Maharaj Nagpur University",
  "North Maharashtra University, Jalgaon",
  "SRTMUN (Swami Ramanand Teerth Marathwada University)",
  // State Technical Universities - Andhra Pradesh & Telangana
  "Jawaharlal Nehru Technological University, Hyderabad (JNTUH)",
  "Jawaharlal Nehru Technological University, Kakinada (JNTUK)",
  "Jawaharlal Nehru Technological University, Anantapur (JNTUA)",
  "Andhra University, Visakhapatnam",
  "Acharya Nagarjuna University",
  "Sri Venkateswara University (SVU, Tirupati)",
  "Osmania University, Hyderabad",
  "Kakatiya University, Warangal",
  // State Technical Universities - Karnataka
  "Visvesvaraya Technological University (VTU, Belgaum)",
  "University of Mysore",
  "Rani Channamma University, Belgaum",
  "Gulbarga University",
  "Bangalore University",
  // State Technical Universities - Tamil Nadu
  "Anna University, Chennai",
  "University of Madras",
  "Bharathiar University, Coimbatore",
  "Madurai Kamaraj University",
  "Anna University of Technology (Tirunelveli)",
  "Anna University of Technology (Coimbatore)",
  // State Technical Universities - Kerala
  "University of Kerala",
  "Cochin University of Science and Technology (CUSAT)",
  "APJ Abdul Kalam Technological University (KTU, Kerala)",
  "Calicut University",
  "Kannur University",
  "Mahatma Gandhi University, Kottayam",
  // State Technical Universities - Uttarakhand
  "Uttarakhand Technical University (UTU, Dehradun)",
  "Hemwati Nandan Bahuguna Garhwal University (HNBGU)",
  "Kumaun University, Nainital",
  "Graphic Era University, Dehradun",
  "Graphic Era Hill University",
  "Dehradun Institute of Technology (DIT)",
  "UPES (University of Petroleum and Energy Studies)",
  "Quantum University, Roorkee",
  "Dev Bhoomi Uttarakhand University",
  "Uttaranchal University",
  "Doon University",
  "ICFAI University, Dehradun",
  "Uttarakhand Open University",
  // State Technical Universities - Bihar
  "Bihar Engineering University (BEU, Patna)",
  "Patna University",
  "Magadh University, Gaya",
  "T.M. Bhagalpur University",
  "Lalit Narayan Mithila University (LNMU)",
  "Nalanda University",
  "Purnea University",
  // State Technical Universities - West Bengal
  "Maulana Abul Kalam Azad University of Technology (MAKAUT)",
  "University of Burdwan",
  "Vidyasagar University",
  "Kalyani University",
  // State Technical Universities - Odisha
  "Biju Patnaik University of Technology (BPUT, Rourkela)",
  "Utkal University, Bhubaneswar",
  "Siksha O Anusandhan University (SOA)",
  // State Technical Universities - Assam & Northeast
  "Assam Science and Technology University (ASTU)",
  "Dibrugarh University",
  "Gauhati University",
  "Tezpur University",
  "Assam University, Silchar",
  "North Eastern Hill University (NEHU)",
  "Mizoram University",
  "Tripura University",
  "Manipur University",
  // State Technical Universities - Himachal Pradesh & J&K
  "Himachal Pradesh Technical University (HPTU)",
  "Himachal Pradesh University, Shimla",
  "Punjab Technical University (PTU, Jalandhar)",
  "Guru Nanak Dev University, Amritsar",
  "Panjab University, Chandigarh",
  "PEC University of Technology, Chandigarh",
  "Chandigarh College of Engineering & Technology",
  "University of Jammu",
  "University of Kashmir",
  "Shri Mata Vaishno Devi University",
  // Central Universities
  "Banaras Hindu University (BHU, Varanasi)",
  "Aligarh Muslim University (AMU)",
  "Jawaharlal Nehru University (JNU, Delhi)",
  "Delhi University (DU)",
  "University of Allahabad",
  "Pondicherry University",
  "University of Hyderabad",
  "Central University of Rajasthan",
  "Central University of Jharkhand",
  "Central University of Karnataka",
  "Central University of Tamil Nadu",
  "Central University of Haryana",
  "Guru Ghasidas Vishwavidyalaya (GGU, Bilaspur)",
  "Dr. Hari Singh Gour Vishwavidyalaya, Sagar",
  "Awadhesh Pratap Singh University (APSU, Rewa)",
  "Rani Durgavati Vishwavidyalaya, Jabalpur",
  "Indira Gandhi Technological & Medical Sciences (IGTMS)",
  "Vinoba Bhave University, Hazaribag",
  "Kameshwar Singh Darbhanga Sanskrit University",
  // IITs
  "Indian Institute of Technology Bombay (IIT Bombay)",
  "Indian Institute of Technology Delhi (IIT Delhi)",
  "Indian Institute of Technology Madras (IIT Madras)",
  "Indian Institute of Technology Kanpur (IIT Kanpur)",
  "Indian Institute of Technology Kharagpur (IIT Kharagpur)",
  "Indian Institute of Technology Roorkee (IIT Roorkee)",
  "Indian Institute of Technology Guwahati (IIT Guwahati)",
  "Indian Institute of Technology Hyderabad (IIT Hyderabad)",
  "Indian Institute of Technology BHU Varanasi (IIT BHU)",
  "Indian Institute of Technology Indore (IIT Indore)",
  "Indian Institute of Technology Mandi (IIT Mandi)",
  "Indian Institute of Technology Patna (IIT Patna)",
  "Indian Institute of Technology Bhubaneswar (IIT Bhubaneswar)",
  "Indian Institute of Technology Ropar (IIT Ropar)",
  "Indian Institute of Technology Jodhpur (IIT Jodhpur)",
  "Indian Institute of Technology Gandhinagar (IIT Gandhinagar)",
  "Indian Institute of Technology Jammu (IIT Jammu)",
  "Indian Institute of Technology Dharwad (IIT Dharwad)",
  "Indian Institute of Technology Palakkad (IIT Palakkad)",
  "Indian Institute of Technology Tirupati (IIT Tirupati)",
  "Indian Institute of Technology Bhilai (IIT Bhilai)",
  "Indian Institute of Technology Goa (IIT Goa)",
  "Indian Institute of Technology (ISM) Dhanbad",
  // NITs
  "National Institute of Technology Trichy (NIT Trichy)",
  "National Institute of Technology Surathkal (NITK)",
  "National Institute of Technology Warangal (NIT Warangal)",
  "National Institute of Technology Calicut (NIT Calicut)",
  "National Institute of Technology Rourkela (NIT Rourkela)",
  "National Institute of Technology Silchar (NIT Silchar)",
  "National Institute of Technology Hamirpur (NIT Hamirpur)",
  "National Institute of Technology Jaipur (NIT Jaipur)",
  "National Institute of Technology Kurukshetra (NIT Kurukshetra)",
  "National Institute of Technology Jalandhar (NIT Jalandhar)",
  "National Institute of Technology Raipur (NIT Raipur)",
  "National Institute of Technology Agartala (NIT Agartala)",
  "National Institute of Technology Delhi (NIT Delhi)",
  "National Institute of Technology Goa (NIT Goa)",
  "National Institute of Technology Andhra Pradesh (NIT AP)",
  "National Institute of Technology Uttarakhand (NIT Uttarakhand)",
  "National Institute of Technology Patna (NIT Patna)",
  "National Institute of Technology Sikkim",
  "National Institute of Technology Nagaland",
  "National Institute of Technology Manipur",
  "National Institute of Technology Meghalaya",
  "National Institute of Technology Mizoram",
  "National Institute of Technology Arunachal Pradesh",
  "National Institute of Technology Puducherry",
  // IIITs
  "Indian Institute of Information Technology Hyderabad (IIIT Hyderabad)",
  "Indian Institute of Information Technology Allahabad (IIIT Allahabad)",
  "IIIT Design & Manufacturing Jabalpur (IIITDMJ)",
  "IIIT Design & Manufacturing Kancheepuram (IIITDMK)",
  "Indian Institute of Information Technology Bangalore (IIIT Bangalore)",
  "Indian Institute of Information Technology Bhopal (IIIT Bhopal)",
  "Indian Institute of Information Technology Bhagalpur (IIIT Bhagalpur)",
  "Indian Institute of Information Technology Dharwad (IIIT Dharwad)",
  "Indian Institute of Information Technology Guwahati (IIIT Guwahati)",
  "Indian Institute of Information Technology Kalyani (IIIT Kalyani)",
  "Indian Institute of Information Technology Kota (IIIT Kota)",
  "Indian Institute of Information Technology Lucknow (IIIT Lucknow)",
  "Indian Institute of Information Technology Manipur (IIIT Manipur)",
  "Indian Institute of Information Technology Nagpur (IIIT Nagpur)",
  "Indian Institute of Information Technology Pune (IIIT Pune)",
  "Indian Institute of Information Technology Sri City (IIIT Sri City)",
  "IIIT Tiruchirappalli (IIIT Trichy)",
  "Indian Institute of Information Technology Una (IIIT Una)",
  "Indian Institute of Information Technology Vadodara (IIIT Vadodara)",
  // Deemed Universities & Private Institutions
  "Birla Institute of Technology and Science (BITS, Pilani)",
  "Birla Institute of Technology and Science (BITS, Goa)",
  "Birla Institute of Technology and Science (BITS, Hyderabad)",
  "Vellore Institute of Technology (VIT, Vellore)",
  "SRM Institute of Science and Technology (SRM, Chennai)",
  "Manipal Academy of Higher Education (MAHE)",
  "Amrita Vishwa Vidyapeetham, Coimbatore",
  "Thapar Institute of Engineering & Technology, Patiala",
  "Shiv Nadar University, Greater Noida",
  "Amity University, Noida",
  "Lovely Professional University (LPU, Phagwara)",
  "Chandigarh University, Mohali",
  "Galgotias University, Greater Noida",
  "Symbiosis International University, Pune",
  "Christ University, Bangalore",
  "St. Xaviers College, Mumbai",
  "JSS Science and Technology University, Mysore",
  "Dayananda Sagar Institutions, Bangalore",
  "Ramaiah Institute of Technology, Bangalore",
  "PES University, Bangalore",
  "BMS College of Engineering, Bangalore",
  "RV College of Engineering, Bangalore",
  "Jaypee Institute of Information Technology (JIIT, Noida)",
  "Manav Rachna University, Faridabad",
  "O.P. Jindal Global University, Sonipat",
  "Maharishi Markandeshwar University, Ambala",
  "KL University, Vijayawada",
  "GITAM (Gandhi Institute of Technology and Management), Visakhapatnam",
  "Kalinga University, Raipur",
  // Private Engineering Colleges - Andhra Pradesh & Telangana
  "Vignans Foundation for Science, Technology & Research, Guntur",
  "Sree Vidyanikethan Engineering College, Tirupati",
  "Vasireddy Venkatadri Institute of Technology, Guntur",
  "Pragati Engineering College, Kakinada",
  "Aditya Engineering College, Kakinada",
  "GMR Institute of Technology, Rajamahendravaram",
  // Private Engineering Colleges - Tamil Nadu
  "Sri Sairam Engineering College, Chennai",
  "Sri Venkateswara College of Engineering, Chennai",
  "Rajalakshmi Engineering College, Chennai",
  "Saveetha Engineering College, Chennai",
  "Vel Tech Rangarajan Dr. Sagunthala R&D Institute, Chennai",
  "Hindustan Institute of Technology and Science, Chennai",
  "St. Josephs College of Engineering, Chennai",
  "Jeppiaar Engineering College, Chennai",
  "Panimalar Engineering College, Chennai",
  "Meenakshi College of Engineering, Chennai",
  "Easwari Engineering College, Chennai",
  "Sri Sairam Institute of Technology, Chennai",
  "Sri Krishna College of Engineering and Technology, Coimbatore",
  "PSG College of Technology, Coimbatore",
  "Coimbatore Institute of Technology",
  "Government College of Technology, Coimbatore",
  "Thiagarajar College of Engineering, Madurai",
  "MEPCO Schlenk Engineering College, Sivakasi",
  "Noorul Islam Centre for Higher Education, Kanyakumari",
  // Private Engineering Colleges - Karnataka
  "Kongu Engineering College, Perundurai",
  "Bapuji Institute of Engineering & Technology, Davangere",
  "The National Institute of Engineering (NIE), Mysore",
  "Siddaganga Institute of Technology, Tumkur",
  "SDM College of Engineering & Technology, Dharwad",
  // Private Engineering Colleges - North India
  "AP Goyal Sharma Engineering College, Meerut",
  "Amrapali Institute of Technology and Sciences, Haldwani",
  "Babu Banarasi Das National Institute of Technology & Management, Lucknow",
  "Dr. K.N. Modi University, Jaipur",
  "Roorkee College of Engineering",
  "BFIT (Bharat Institute of Technology), Dehradun",
  "Quantum School of Technology, Roorkee",
  "Himgiri Zee University, Dehradun",
  "Sri Guru Ram Dass Institute of Engineering & Technology, Amritsar",
  "Himalayan Institute of Technology, Dehradun",
  "IMS Engineering College, Ghaziabad",
  "ABES Engineering College, Ghaziabad",
  "Kashi Institute of Technology, Varanasi",
  "GL Bajaj Institute of Technology, Greater Noida",
  "Sharda University, Greater Noida",
  "NIET (Noida Institute of Engineering & Technology)",
  "Galgotias College of Engineering & Technology, Greater Noida",
  "Dronacharya College of Engineering, Faridabad",
  "Sant Longowal Institute of Engineering & Technology",
  // Private Engineering Colleges - Other
  "Raghu Engineering College, Visakhapatnam",
  "Pyda Engineering College, Srikakulam",
  "Sagi Ramakrishnam Raju Engineering College, Bhimavaram",
  "Valluri Academy of Management & Technology, Visakhapatnam",
  "Anil Neerukonda Institute of Technology and Sciences, Visakhapatnam",
  "Madurai Institute of Social Sciences",
  // Other Major Institutions
  "Kalinga Institute of Industrial Technology (KIIT, Bhubaneswar)",
  "Veer Surendra Sai University of Technology (VSSUT, Odisha)",
  "Ballari Institute of Technology & Management",
  // Other
  "Other",
];

const courses = [
  "Bachelor of Technology (B.Tech)",
  "Master of Technology (M.Tech)",
  "Bachelor of Computer Applications (BCA)",
  "Master of Computer Applications (MCA)",
  "Bachelor of Science (B.Sc)",
  "Master of Science (M.Sc)",
  "Bachelor of Engineering (B.E)",
  "Master of Engineering (M.E)",
];

const branchesByCourse: Record<string, string[]> = {
  "Bachelor of Technology (B.Tech)": [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biotechnology",
  ],
  "Master of Technology (M.Tech)": [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ],
  "Bachelor of Computer Applications (BCA)": ["Computer Applications"],
  "Master of Computer Applications (MCA)": ["Computer Applications"],
  "Bachelor of Science (B.Sc)": [
    "Computer Science",
    "Information Technology",
    "Mathematics",
    "Physics",
    "Chemistry",
  ],
  "Master of Science (M.Sc)": [
    "Computer Science",
    "Information Technology",
    "Mathematics",
    "Physics",
    "Chemistry",
  ],
  "Bachelor of Engineering (B.E)": [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ],
  "Master of Engineering (M.E)": [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ],
};

export function CollegeDetailsForm({
  details,
  onSave,
  onFetchSyllabus,
  isFetching,
}: CollegeDetailsFormProps) {
  const [isEditing, setIsEditing] = useState(!details);
  const [form, setForm] = useState<CollegeDetails>(
    details || {
      university: "",
      course: "",
      branch: "",
      year: 1,
      semester: 1,
    }
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [uniSearch, setUniSearch] = useState("");

  const handleDropdownToggle = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
      setUniSearch("");
    } else {
      setOpenDropdown(name);
    }
  };

  const filteredUniversities = useMemo(() => {
    if (!uniSearch.trim()) return universities;
    const q = uniSearch.toLowerCase();
    return universities.filter((u) => u.toLowerCase().includes(q));
  }, [uniSearch]);

  const availableBranches = branchesByCourse[form.course] || [];

  const handleSave = () => {
    if (form.university && form.course && form.branch) {
      onSave(form);
      setIsEditing(false);
    }
  };

  const handleFetch = () => {
    onFetchSyllabus();
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-2.5 shadow-lg shadow-primary/20">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">College Details</h3>
            <p className="text-xs text-muted-foreground/60">
              {details
                ? `${details.branch} - ${details.course}`
                : "Set up your college profile"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {details && !isEditing && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFetch}
              disabled={isFetching}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 transition-all duration-200"
            >
              {isFetching ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Fetch Syllabus
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
            {isEditing ? "Cancel" : "Edit"}
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* University */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  University
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => handleDropdownToggle("university")}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-left transition-all duration-200",
                      "hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20",
                      form.university ? "text-foreground" : "text-muted-foreground/50"
                    )}
                  >
                    <span>{form.university || "Select university"}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openDropdown === "university" && "rotate-180"
                      )}
                    />
                  </button>
                  {openDropdown === "university" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                    >
                      <div className="sticky top-0 z-10 border-b border-border/50 bg-card p-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                          <input
                            type="text"
                            placeholder="Search university..."
                            value={uniSearch}
                            onChange={(e) => setUniSearch(e.target.value)}
                            className="w-full rounded-lg border border-border bg-muted/30 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredUniversities.length === 0 ? (
                          <p className="px-4 py-3 text-sm text-muted-foreground/60">
                            No university found
                          </p>
                        ) : (
                          filteredUniversities.map((uni) => (
                            <button
                              key={uni}
                              onClick={() => {
                                setForm({ ...form, university: uni });
                                setOpenDropdown(null);
                                setUniSearch("");
                              }}
                              className={cn(
                                "flex w-full items-center gap-3 px-4 py-3 text-sm text-left hover:bg-muted/50 transition-colors",
                                form.university === uni && "bg-primary/10 text-primary"
                              )}
                            >
                              {form.university === uni && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                              <span className={form.university === uni ? "" : "ml-7"}>
                                {uni}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Course */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Course
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => handleDropdownToggle("course")}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-left transition-all duration-200",
                      "hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20",
                      form.course ? "text-foreground" : "text-muted-foreground/50"
                    )}
                  >
                    <span>{form.course || "Select course"}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openDropdown === "course" && "rotate-180"
                      )}
                    />
                  </button>
                  {openDropdown === "course" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                    >
                      <div className="max-h-60 overflow-y-auto">
                        {courses.map((course) => (
                          <button
                            key={course}
                            onClick={() => {
                              setForm({ ...form, course, branch: "" });
                              setOpenDropdown(null);
                            }}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-3 text-sm text-left hover:bg-muted/50 transition-colors",
                              form.course === course && "bg-primary/10 text-primary"
                            )}
                          >
                            {form.course === course && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                            <span className={form.course === course ? "" : "ml-7"}>
                              {course}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Branch */}
              {form.course && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    Branch / Specialization
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => handleDropdownToggle("branch")}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-left transition-all duration-200",
                        "hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20",
                        form.branch ? "text-foreground" : "text-muted-foreground/50"
                      )}
                    >
                      <span>{form.branch || "Select branch"}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          openDropdown === "branch" && "rotate-180"
                        )}
                      />
                    </button>
                    {openDropdown === "branch" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                      >
                        <div className="max-h-60 overflow-y-auto">
                          {availableBranches.map((branch) => (
                            <button
                              key={branch}
                              onClick={() => {
                                setForm({ ...form, branch });
                                setOpenDropdown(null);
                              }}
                              className={cn(
                                "flex w-full items-center gap-3 px-4 py-3 text-sm text-left hover:bg-muted/50 transition-colors",
                                form.branch === branch && "bg-primary/10 text-primary"
                              )}
                            >
                              {form.branch === branch && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                              <span className={form.branch === branch ? "" : "ml-7"}>
                                {branch}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Year and Semester */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Year
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          const maxSem = year * 2;
                          setForm({
                            ...form,
                            year,
                            semester: Math.min(form.semester, maxSem),
                          });
                        }}
                        className={cn(
                          "flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-all duration-200",
                          form.year === year
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Semester
                  </label>
                  <div className="flex gap-2">
                    {[1, 2].map((sem) => {
                      const semNum = (form.year - 1) * 2 + sem;
                      const maxSem = form.year * 2;
                      return (
                        <button
                          key={sem}
                          onClick={() => setForm({ ...form, semester: semNum })}
                          disabled={semNum > maxSem}
                          className={cn(
                            "flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-all duration-200",
                            form.semester === semNum
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                            semNum > maxSem && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {semNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSave}
                disabled={!form.university || !form.course || !form.branch}
                className="w-full rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Save Details
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {details ? (
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground/60 mb-1">University</p>
                    <p className="text-sm font-medium text-foreground">{details.university}</p>
                  </div>
                  <div className="rounded-xl bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground/60 mb-1">Course</p>
                    <p className="text-sm font-medium text-foreground">{details.course}</p>
                  </div>
                  <div className="rounded-xl bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground/60 mb-1">Branch</p>
                    <p className="text-sm font-medium text-foreground">{details.branch}</p>
                  </div>
                  <div className="rounded-xl bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground/60 mb-1">Year</p>
                    <p className="text-sm font-medium text-foreground">{details.year}</p>
                  </div>
                  <div className="rounded-xl bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground/60 mb-1">Semester</p>
                    <p className="text-sm font-medium text-foreground">{details.semester}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center">
                <p className="text-sm text-muted-foreground/60">
                  No details added yet. Click Edit to set up your college profile.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
