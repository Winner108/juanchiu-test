import { useState, useContext } from "react";
import { DialogProps } from "./useDialog";
import {
    Modal,
    Paper,
    Stack,
    Typography,
    IconButton,
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getClients, createClient } from "../../services/api";
import { StateContext } from "../../store/DataProvider";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    boxShadow: 24,
    p: 4,
};

const steps = ['Personal Details', 'Contact Details'];

const personalValidationSchema = yup.object({
    firstName: yup
        .string()
        .required('First name is required'),
    lastName: yup
        .string()
        .required('Last name is required')
});

const contactValidationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    phoneNumber: yup
        .string()
        .required('Phone number is required')
});

interface Formprops {
    activeStep: number;
    formData: any;
    handleNext: () => void;
    handleBack: () => void;
    handleSubmit: (data: any) => void;
    setFormData: (value: any) => void;
}

export function CreateClientDialog(props: DialogProps<{}, void>) {
    const { dispatch } = useContext(StateContext);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [formData, setFormData] = useState<any>({});

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = (data: any) => {
        createClient(data).then((clients) => {
            props.closeDialog();
            updateClients();
        });
    };

    const updateClients = () => {
        getClients().then((clients) =>
            dispatch({ type: "FETCH_ALL_CLIENTS", data: clients })
        );
    }

    return (
        <Modal open onClose={() => props.closeDialog()}>
            <Paper sx={style}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Create new client</Typography>
                    <IconButton onClick={() => props.closeDialog()}>
                        <Close />
                    </IconButton>
                </Stack>
                <Box>
                    <Stepper activeStep={activeStep} sx={{ my: 3 }}>
                        {steps.map((label) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {
                        activeStep === 0 && <PersonalForm
                            activeStep={activeStep}
                            handleBack={handleBack}
                            handleNext={handleNext}
                            handleSubmit={handleSubmit}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    }
                    {
                        activeStep === 1 && <ContactForm
                            activeStep={activeStep}
                            handleBack={handleBack}
                            handleNext={handleNext}
                            handleSubmit={handleSubmit}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    }
                </Box>
            </Paper>
        </Modal>
    );
}

function PersonalForm(props: Formprops) {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
        },
        validationSchema: personalValidationSchema,
        onSubmit: values => {
            props.setFormData({
                ...props.formData,
                firstName: values.firstName,
                lastName: values.lastName
            })
            props.handleNext();
        },
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    name="firstName"
                    label="First name"
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                />
                <TextField
                    name="lastName"
                    label="Last name"
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                />
            </Stack>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, justifyContent: 'space-between' }}>
                <Box />
                <Button type="submit">Next</Button>
            </Box>
        </Box>
    )
}

function ContactForm(props: Formprops) {
    const formik = useFormik({
        initialValues: {
            email: '',
            phoneNumber: '',
        },
        validationSchema: contactValidationSchema,
        onSubmit: values => {
            const formData = {
                ...props.formData,
                email: values.email,
                phoneNumber: values.phoneNumber
            };
            props.handleSubmit(formData);
        },
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    name="phoneNumber"
                    label="Phone number"
                    variant="outlined"
                    onChange={formik.handleChange}
                    value={formik.values.phoneNumber}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
            </Stack>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, justifyContent: 'space-between' }}>
                <Button onClick={props.handleBack}>Back</Button>
                <Button type="submit">Create client</Button>
            </Box>
        </Box>
    )
}