const Service = require("../../models/Service");
const User = require("../../models/User");

/*     Get All Services by Vendor    */
const getServicesByVendor = async (req, res) => {
  try {
    const {
      page: pageQuery,
      limit: limitQuery,
      search: searchQuery,
    } = req.query;

    const limit = parseInt(limitQuery) || 10;
    const page = parseInt(pageQuery) || 1;
    const skip = limit * (page - 1);

    const matchQuery = { vendor: req.vendor._id.toString() };

    const totalServices = await Service.countDocuments({
      poojaType: { $regex: searchQuery || "", $options: "i" },
      ...matchQuery,
    });

    const services = await Service.find({
      poojaType: { $regex: searchQuery || "", $options: "i" },
      ...matchQuery,
    })
      .select("poojaType description duration price createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: services,
      total: totalServices,
      count: Math.ceil(totalServices / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/*     Create Service by Vendor    */
const createServiceByVendor = async (req, res) => {
  try {
    const { poojaType, description, duration, price } = req.body;

    // Check if service already exists for this vendor
    const existingService = await Service.findOne({
      poojaType,
      vendor: req.vendor._id.toString(),
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: "Service already exists for this pooja type",
      });
    }

    const service = await Service.create({
      poojaType,
      description,
      duration,
      price,
      vendor: req.vendor._id.toString(),
    });

    // Add service to vendor's services array
    await User.findByIdAndUpdate(req.vendor._id, {
      $push: { services: service._id },
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/*     Get One Service by Vendor    */
const getOneServiceByVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findOne({
      _id: id,
      vendor: req.vendor._id.toString(),
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/*     Update Service by Vendor    */
const updateServiceByVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { poojaType, description, duration, price } = req.body;

    // Check if service exists and belongs to vendor
    const existingService = await Service.findOne({
      _id: id,
      vendor: req.vendor._id.toString(),
    });

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check if another service with same poojaType exists (excluding current one)
    if (poojaType && poojaType !== existingService.poojaType) {
      const duplicateService = await Service.findOne({
        poojaType,
        vendor: req.vendor._id.toString(),
        _id: { $ne: id },
      });

      if (duplicateService) {
        return res.status(400).json({
          success: false,
          message: "Service already exists for this pooja type",
        });
      }
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { poojaType, description, duration, price },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/*     Delete Service by Vendor    */
const deleteServiceByVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findOne({
      _id: id,
      vendor: req.vendor._id.toString(),
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await Service.findByIdAndDelete(id);

    // Remove service from vendor's services array
    await User.findByIdAndUpdate(req.vendor._id, {
      $pull: { services: service._id },
    });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createServiceByVendor,
  getServicesByVendor,
  getOneServiceByVendor,
  updateServiceByVendor,
  deleteServiceByVendor,
};
