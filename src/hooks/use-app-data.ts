import { useLocalStorage } from './use-local-storage';

// Types
export type GrievanceStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Grievance {
  id: string;
  title: string;
  category: string;
  description: string;
  state: string;
  district: string;
  photoUrl: string;
  pinLat?: number;
  pinLng?: number;
  pinAddress?: string;
  status: GrievanceStatus;
  createdAt: number;
}

export type ItemType = 'Lost' | 'Found';

export interface LostItem {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  state: string;
  district: string;
  location: string;
  contact: string;
  imageUrl?: string;
  createdAt: number;
}

// Hooks
export function useGrievances() {
  const [grievances, setGrievances] = useLocalStorage<Grievance[]>('impact_hub_grievances_v2', []);

  const addGrievance = (grievance: Omit<Grievance, 'id' | 'createdAt' | 'status'>) => {
    const newGrievance: Grievance = {
      ...grievance,
      id: crypto.randomUUID(),
      status: 'Pending',
      createdAt: Date.now(),
    };
    setGrievances(prev => [newGrievance, ...prev]);
    return newGrievance;
  };

  const updateStatus = (id: string, status: GrievanceStatus) => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, status } : g));
  };

  return { grievances, addGrievance, updateStatus };
}

export function useLostItems() {
  const [items, setItems] = useLocalStorage<LostItem[]>('impact_hub_lost_items_v2', []);

  const addItem = (item: Omit<LostItem, 'id' | 'createdAt'>) => {
    const newItem: LostItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const resolveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return { items, addItem, resolveItem };
}

export function useWelcomeState() {
  return useLocalStorage<{ hasSeen: boolean; language: 'en' | 'hi' }>('impact_hub_welcome_v2', {
    hasSeen: false,
    language: 'en'
  });
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
    'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Bara Banki',
    'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
    'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur',
    'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur',
    'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi',
    'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar',
    'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri',
    'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit',
    'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
    'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra',
    'Sultanpur', 'Unnao', 'Varanasi',
  ],
  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana',
    'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
    'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
    'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad',
    'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha',
    'Washim', 'Yavatmal',
  ],
  'Delhi': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi',
    'West Delhi',
  ],
  'Karnataka': [
    'Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar',
    'Chamarajanagara', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada',
    'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu',
    'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
    'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir',
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar',
    'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Gandhinagar', 'Gir Somnath',
    'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi',
    'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha',
    'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad',
  ],
  'Rajasthan': [
    'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara',
    'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur',
    'Ganganagar', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar',
    'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh',
    'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur',
  ],
  'Bihar': [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur',
    'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad',
    'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura',
    'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia',
    'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi',
    'Siwan', 'Supaul', 'Vaishali', 'West Champaran',
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul',
    'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia',
    'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore',
    'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur',
    'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam',
    'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur',
    'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha',
  ],
  'Tamil Nadu': [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
    'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
    'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
    'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
    'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
    'Viluppuram', 'Virudhunagar',
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
    'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
    'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
    'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur',
  ],
  'Punjab': [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
    'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana',
    'Mansa', 'Moga', 'Mohali', 'Muktsar', 'Nawanshahr', 'Pathankot', 'Patiala',
    'Ropar', 'Sangrur', 'Tarn Taran',
  ],
  'Haryana': [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram',
    'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh',
    'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat',
    'Yamunanagar',
  ],
  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam',
    'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram',
    'Thrissur', 'Wayanad',
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial', 'Jangaon',
    'Jayashankar', 'Jogulamba', 'Kamareddy', 'Karimnagar', 'Khammam', 'Kumuram Bheem',
    'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal Malkajgiri', 'Mulugu',
    'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli',
    'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad',
    'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri',
  ],
  'Andhra Pradesh': [
    'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla',
    'Chittoor', 'Eluru', 'Guntur', 'Kakinada', 'Konaseema', 'Krishna', 'Kurnool',
    'Nandyal', 'NTR', 'Nellore', 'Palnadu', 'Prakasam', 'Srikakulam', 'Sri Sathya Sai',
    'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa',
  ],
};

export function getDistricts(state: string): string[] {
  return DISTRICTS_BY_STATE[state] ?? [];
}
