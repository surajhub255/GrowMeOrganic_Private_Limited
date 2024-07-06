import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { List, ListItem, ListItemText, Collapse, IconButton, Checkbox } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const departmentsData = [
    {
        "department": "Marketing",
        "sub_departments": [
            "Digital Marketing",
            "Content Marketing",
            "SEO"
        ]
    },
    {
        "department": "Sales",
        "sub_departments": [
            "Direct Sales",
            "Channel Sales",
            "Inside Sales"
        ]
    },
    {
        "department": "Engineering",
        "sub_departments": [
            "Frontend",
            "Backend",
            "DevOps"
        ]
    }
];

interface DepartmentState {
    [key: string]: boolean;
}

interface SubDepartmentState {
    [key: string]: { [key: string]: boolean };
}
const FetchData: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDepartments, setSelectedDepartments] = useState<DepartmentState>({});
    const [selectedSubDepartments, setSelectedSubDepartments] = useState<SubDepartmentState>({});
    const [open, setOpen] = useState<{ [key: string]: boolean }>({});

    const handleToggle = (department: string) => {
        setOpen(prevOpen => ({
            ...prevOpen,
            [department]: !prevOpen[department]
        }));
    };

    const handleDepartmentSelect = (department: string) => {
        const isSelected = !selectedDepartments[department];
        setSelectedDepartments(prevState => ({
            ...prevState,
            [department]: isSelected
        }));

        setSelectedSubDepartments(prevState => {
            const newState = { ...prevState };
            departmentsData.find(dep => dep.department === department)?.sub_departments.forEach(subDep => {
                if (!newState[department]) newState[department] = {};
                newState[department][subDep] = isSelected;
            });
            return newState;
        });
    };

    const handleSubDepartmentSelect = (department: string, subDepartment: string) => {
        const isSelected = !selectedSubDepartments[department]?.[subDepartment];

        setSelectedSubDepartments(prevState => {
            const newState = { ...prevState };
            if (!newState[department]) newState[department] = {};
            newState[department][subDepartment] = isSelected;

            const allSelected = departmentsData.find(dep => dep.department === department)?.sub_departments.every(subDep => newState[department][subDep]);
            if (allSelected) {
                setSelectedDepartments(prevState => ({
                    ...prevState,
                    [department]: true
                }));
            } else {
                setSelectedDepartments(prevState => ({
                    ...prevState,
                    [department]: false
                }));
            }

            return newState;
        });
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts');
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data: Post[] = await response.json();
                setPosts(data);
            } catch (error) {
                setError("Failed to fetch the data");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Define the columns for the DataGrid
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'userId', headerName: 'User ID', width: 150 },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'body', headerName: 'Body', width: 800 },
    ];

    return (
        <>
            <div style={{ height: 600, width: '100%' }} >
                <h1 className='c2'>Component 1</h1>
                <DataGrid rows={posts} columns={columns}/>
            </div>
            <br />   <br />   <br />
            <List>
                <h1 className='c2'>Component 2</h1>
                {departmentsData.map(department => (
                    <div key={department.department} >
                        <ListItem>
                            <Checkbox
                                checked={!!selectedDepartments[department.department]}
                                onChange={() => handleDepartmentSelect(department.department)}
                            />
                            <ListItemText primary={department.department} onClick={() => handleToggle(department.department)} className='head'/>
                            <IconButton onClick={() => handleToggle(department.department)}>
                                {open[department.department] ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </ListItem>
                        <Collapse in={!!open[department.department]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {department.sub_departments.map(subDepartment => (
                                    <ListItem key={subDepartment} sx={{ pl: 4 }}>
                                        <Checkbox
                                            checked={!!selectedSubDepartments[department.department]?.[subDepartment]}
                                            onChange={() => handleSubDepartmentSelect(department.department, subDepartment)}
                                        />
                                        <ListItemText primary={subDepartment} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </div>
                ))}
            </List>
        </>

    );
};
export default FetchData;
