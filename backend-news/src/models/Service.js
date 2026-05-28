const mongoose = require("mongoose");

const poojaType = [
  "Shrimad Bhagwat Katha Pooja",
  "Shri Manas Amrit Ram Katha Pooja",
  "Satyanarayan Puja",
  "Rudrabhishek Puja",
  "Basic Puja",
  "Bhoomi Pujan",
  "Griha Pravesh Puja",
  "Vastu Shanti Puja",
  "Naamkaran Puja",
  "Annaprashan Sanskar Puja",
  "Saraswati Puja",
  "Navratri Puja",
  "Sunderkand Path",
  "Dhanteras Puja",
  "Diwali Puja",
  "Engagement Puja",
  "Tilak Puja",
  "Vivah Pujan",
  "Haritalika Teej Vrat Puja",
  "Vishwakarma Puja",
  "Durga Saptashati Puja",
  "Navgraha Shanti Puja",
  "Budh Shanti Puja",
  "Shukra Shanti Puja",
  "Chandra Shanti Puja",
  "Guru Shanti Puja",
  "Surya Shanti Puja",
  "Mangal Shanti Puja",
  "Rahu Graha Shanti Puja",
  "Ketu Graha Shanti Puja",
  "Shani Graha Shanti Puja",
  "Mahashivratri Puja",
  "Rudra Puja",
  "Pitra Dosh Nivaran Puja",
  "Narayan Nagbali Puja",
  "Kalsarpa Dosh Nivaran Puja",
  "Baglamukhi Puja",
  "Mahamrityunjaya Jaap",
  "Garuda Puran Path",
  "Ganesh Chaturthi Puja",
  "Janeu Sanskar",
  "Business Opening Puja",
  "Manglik Dosh Nivaran Puja",
  "Shanti Puja",
  "Idol Pran Pratishtha Puja",
  "Hanuman Chalisa Path",
  "Shiv Puran Path",
  "New Office Opening Puja",
  "Marriage Anniversary Puja",
  "Varshika Shradhya Puja",
  "Godh Bharai",
  "Kuber Upasana Puja",
  "Janmdin Puja",
  "Santan Gopal Mantra Jaap",
  "Shuddhikaran Puja",
  "Gayatri Mantra Jaap",
  "Krishna Janmashtami Puja",
  "Hanuman Janmotsav Puja",
  "Ram Navami Puja",
  "Akshaya Tritiya Puja",
  "Holika Puja",
  "Govardhan Puja",
  "Mahalakshmi Puja",
  "Pind Daan Puja",
  "Pitra Paksha Shradhya Puja",
  "Tripindi Shradhya Puja",
  "Bharani Shradhya Puja",
  "Rin Mukti Puja",
  "Others"
];


const ServiceSchema = new mongoose.Schema(
  {
    poojaType: {
      type: String,
      // enum: poojaTypes,
      required: [true, "Pooja type is required"],
      // REMOVED unique: true from here - yeh problem ka root cause tha
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"],
    },
  },
  {
    timestamps: true,
  }
);

// ✅ COMPOUND UNIQUE INDEX: Same poojaType can exist for different vendors
// But one vendor cannot have duplicate poojaType
ServiceSchema.index({ poojaType: 1, vendor: 1 }, { unique: true });

const Service =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);
module.exports = Service;
