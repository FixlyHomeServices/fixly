// controllers/feedback.controller.js
// In a real application, you would use a database like MongoDB
// For now, we'll store feedback in memory
const feedbackList = [];

/**
 * Create new feedback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createFeedback = (req, res) => {
  try {
    const { issueType, fullName, email, mobile, message } = req.body;
    
    // Validate required fields
    if (!issueType || !fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Create feedback object
    const newFeedback = {
      id: Date.now().toString(),
      issueType,
      fullName,
      email,
      mobile: mobile || 'Not provided',
      message,
      createdAt: new Date()
    };
    
    // Save to "database" (in-memory array)
    console.log('New Feedback Created:', newFeedback);
    feedbackList.push(newFeedback);
    
    // Success response
    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: newFeedback
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all feedback (for admin purposes)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllFeedback = (req, res) => {
  try {
    console.log('All Feedback:', feedbackList);
    return res.status(200).json({
      success: true,
      count: feedbackList.length,
      data: feedbackList
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get feedback by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getFeedbackById = (req, res) => {
  try {
    const { id } = req.params;
    const feedback = feedbackList.find(item => item.id === id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete feedback by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteFeedback = (req, res) => {
  try {
    const { id } = req.params;
    const index = feedbackList.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    // Remove from array
    feedbackList.splice(index, 1);
    
    return res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};