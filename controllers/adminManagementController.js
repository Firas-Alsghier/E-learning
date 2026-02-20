import User from '../models/User.js';

/*
--------------------------------
GET ADMINS & SUPERVISORS
--------------------------------
*/
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ['super_admin', 'admin', 'supervisor'] },
    }).select('-password');

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch admins',
    });
  }
};

/*
--------------------------------
ADD ADMIN / SUPERVISOR
--------------------------------
*/
export const addAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password, // assume you hash in pre-save middleware
      role,
    });

    res.status(201).json({
      message: 'Admin created successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create admin',
    });
  }
};

/*
--------------------------------
UPDATE ADMIN ROLE
--------------------------------
*/
export const updateAdminRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      message: 'Role updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update role',
    });
  }
};

/*
--------------------------------
DELETE ADMIN
--------------------------------
*/
export const deleteAdmin = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Admin removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete admin',
    });
  }
};
