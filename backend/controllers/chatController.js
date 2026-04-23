import { generateChatResponse } from '../services/ai/chatAgent.js';

export const handleChat = async (req, res) => {
  try {
    const { userQuestion, userProfile, selectedPolicy, chatHistory } = req.body;

    if (!userQuestion || typeof userQuestion !== 'string' || userQuestion.trim() === '') {
      return res.status(400).json({ success: false, message: 'userQuestion is required and must be a non-empty string.' });
    }

    if (!userProfile || typeof userProfile !== 'object') {
      return res.status(400).json({ success: false, message: 'userProfile object is required.' });
    }

    const { fullName, age, lifestyle, preExistingConditions, incomeBand, cityTier } = userProfile;
    if (age === undefined || !lifestyle || !preExistingConditions || !incomeBand || !cityTier) {
       return res.status(400).json({ success: false, message: 'userProfile must contain age, lifestyle, preExistingConditions, incomeBand, and cityTier.' });
    }

    const result = await generateChatResponse(
      userQuestion,
      userProfile,
      selectedPolicy || null,
      chatHistory || []
    );

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error occurred during chat processing.'
    });
  }
};
