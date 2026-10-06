import React, { useId } from 'react';
import { majorIndianCities } from '../../utils/indianCities';

const CityInput = ({ value, onChange, className = 'input-field', placeholder = 'City', required = false }) => {
  const listId = `indian-cities-${useId().replace(/:/g, '')}`;

  return (
    <>
      <input
        required={required}
        list={listId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
      />
      <datalist id={listId}>
        {majorIndianCities.map((city) => <option key={city} value={city} />)}
      </datalist>
    </>
  );
};

export default CityInput;