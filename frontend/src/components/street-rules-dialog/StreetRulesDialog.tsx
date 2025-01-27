import React, { useState, useEffect } from 'react';
import { fetchStreetRules } from '../../services/api';
import './StreetRulesDialog.css';

interface StreetRulesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  countries: string[];
}

interface StreetRule {
  country_name: string;
  speed_limits: {
    default: {
      city: number;
      highway: number;
      school_zone: number;
    };
  };
  other_rules: {
    mandatory_items: {
      first_aid_kit: boolean;
      warning_triangle: boolean;
      reflective_vests: boolean;
      spare_tire: boolean;
    };
    seatbelt_mandatory: boolean;
    alcohol_limit: number;
    driving_age_limit: number;
  };
  accepted_driver_ids: {
    vienna: boolean;
    geneva: boolean;
    eu: boolean;
    american: boolean;
  };
  fees: {
    highway: boolean;
    toll_price: number;
  };
}

const StreetRulesDialog: React.FC<StreetRulesDialogProps> = ({
  isOpen,
  onClose,
  countries,
}) => {
  const [rules, setRules] = useState<StreetRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && countries.length > 0) {
      const fetchRules = async () => {
        setLoading(true);
        setError(null);

        try {
          const rulesData: StreetRule[] = await Promise.all(
            countries.map(async (country) => {
              return await fetchStreetRules(country);
            })
          );
          setRules(rulesData);
        } catch (err) {
          console.error('Error fetching street rules:', err);
          setError('Failed to load street rules.');
        } finally {
          setLoading(false);
        }
      };

      fetchRules();
    }
  }, [isOpen, countries]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Street Rules</h2>
      <button onClick={onClose}>Close</button>
      {loading ? (
        <p>Loading street rules...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="rules-container">
          {rules.map((rule, index) => (
            <div key={index} className="rule-card">
              <h3>{rule.country_name}</h3>
              <p>
                <strong>Speed Limits:</strong> City:{'\n'}
                {rule.speed_limits.default.city} km/h, Highway:{'\n'}
                {rule.speed_limits.default.highway} km/h, School Zone:{'\n'}
                {rule.speed_limits.default.school_zone} km/h
              </p>
              <p>
                <strong>Mandatory Items:</strong> First Aid Kit:{' '}
                {rule.other_rules.mandatory_items.first_aid_kit ? 'Yes' : 'No'},
                Reflective Vests:{' '}
                {rule.other_rules.mandatory_items.reflective_vests
                  ? 'Yes'
                  : 'No'}
              </p>
              <p>
                <strong>Other Rules:</strong> Seatbelt Mandatory:{' '}
                {rule.other_rules.seatbelt_mandatory ? 'Yes' : 'No'}, Alcohol
                Limit: {rule.other_rules.alcohol_limit}‰
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreetRulesDialog;
