import React from 'react';
import MyPropertiesList from '../../components/customer/MyPropertiesList';

const MyPropertiesPage = ({
	listPropertyPath = '/dashboard/list-property',
	editPropertyPath = '/dashboard/edit-property',
}) => <MyPropertiesList listPropertyPath={listPropertyPath} editPropertyPath={editPropertyPath} />;

export default MyPropertiesPage;
