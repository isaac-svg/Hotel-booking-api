import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};
export const getHotels = async (req, res, next) => {
  const { min, max, city, ...others } = req.query;
  console.log(city, "city")
  try {
    const query = {
      ...others,
      cheapestPrice: { $gt: min || 1, $lt: max || 999 },
    };

    if (city) {
      query.$or = [
        { city: { $regex: new RegExp(city, 'i') } },
        { $text: { $search: city } } // Text search for fuzzy matching
      ];
    }

    const hotels = await Hotel.find({
      $and: [
        { city: { $regex: new RegExp(city, 'i') } }, // City contains the specified substring
        { cheapestPrice: { $gte: min || 1, $lte: max || 1000} }, // Price is within the specified range
      ],

    }).limit(req.query.limit);
    console.log(hotels);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    
    const [hotelCount, apartmentCount, resortCount, villaCount, cabinCount] = await Promise.all(
      [Hotel.countDocuments({ type: "Luxury" }),
      Hotel.countDocuments({ type: "Business" }),
    Hotel.countDocuments({ type: "Resort" }),
    Hotel.countDocuments({ type: "Budget" }),
    Hotel.countDocuments({ type: "Boutique" })])

   return res.status(200).json([
    { type: "Luxury", count: hotelCount },
    { type: "Business", count: apartmentCount },
    { type: "resorts", count: resortCount },
    { type: "Resort", count: villaCount },
    { type: "Boutique", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};
