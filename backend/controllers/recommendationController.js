import { generateRecommendation } from '../services/ai/agent.js';

export const createRecommendation = async (req, res) => {
  try {
    const { fullName, age, lifestyle, preExistingConditions, incomeBand, cityTier } = req.body;

    const errors = [];

    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      errors.push('fullName is required and must be a non-empty string.');
    }

    if (age === undefined || typeof age !== 'number' || !Number.isInteger(age) || age < 1 || age > 99) {
      errors.push('age is required and must be an integer between 1 and 99.');
    }

    const allowedLifestyles = ['Sedentary', 'Moderate', 'Active', 'Athlete'];
    if (!lifestyle || !allowedLifestyles.includes(lifestyle)) {
      errors.push(`lifestyle is required and must be one of: ${allowedLifestyles.join(', ')}.`);
    }

    const allowedConditions = ['Diabetes', 'Hypertension', 'Asthma', 'Cardiac', 'None', 'Other'];
    if (!preExistingConditions || !Array.isArray(preExistingConditions) || preExistingConditions.length === 0) {
      errors.push('preExistingConditions is required and must be a non-empty array of strings.');
    } else {
      const invalidConditions = preExistingConditions.filter(c => !allowedConditions.includes(c));
      if (invalidConditions.length > 0) {
        errors.push(`preExistingConditions contains invalid values: ${invalidConditions.join(', ')}. Allowed values are: ${allowedConditions.join(', ')}.`);
      }
    }

    const allowedIncomeBands = ['under 3L', '3-8L', '8-15L', '15L+'];
    if (!incomeBand || !allowedIncomeBands.includes(incomeBand)) {
      errors.push(`incomeBand is required and must be one of: ${allowedIncomeBands.join(', ')}.`);
    }

    const allowedCityTiers = ['Metro', 'Tier-2', 'Tier-3'];
    if (!cityTier || !allowedCityTiers.includes(cityTier)) {
      errors.push(`cityTier is required and must be one of: ${allowedCityTiers.join(', ')}.`);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check your request data.',
        errors
      });
    }

    const validatedData = {
      fullName: fullName.trim(),
      age,
      lifestyle,
      preExistingConditions,
      incomeBand,
      cityTier
    };

    const recommendation = await generateRecommendation(validatedData);

    return res.status(200).json({
      success: true,
      message: 'Recommendation generated successfully.',
      data: recommendation
    });
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error occurred.'
    });
  }
};
