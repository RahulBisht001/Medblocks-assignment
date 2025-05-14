"use client";

import {useState, useEffect} from "react";
import {registrationFormSchema} from "../utils/FormValidationSchema";
import {useDb} from "../context/DbContext";

const RegistrationForm = () => {
    const db = useDb();
    const initialFormState = {
        fullname: "",
        age: "",
        contact: "",
        disease: "",
        gender: "",
    };

    const [formValues, setFormValues] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const savedFormValues = localStorage.getItem("formValues");
        if (savedFormValues) {
            setFormValues(JSON.parse(savedFormValues));
        }

        const handleStorageChange = (event) => {
            if (event.key === "formValues") {
                setFormValues(JSON.parse(event.newValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleChange = async (e) => {
        const {name, value} = e.target;

        setFormValues((prev) => {
            const updatedFormValues = {
                ...prev,
                [name]: value,
            };

            // Persist updated form values to localStorage
            localStorage.setItem("formValues", JSON.stringify(updatedFormValues));

            return updatedFormValues;
        });

        // Skip validation if field is empty
        if (value === "") {
            // Optionally: clear error (or leave last error until submit)
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
            return;
        }

        try {
            await registrationFormSchema.validateAt(name, {
                ...formValues,
                [name]: value,
            });

            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                [name]: error.message,
            }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const validatedData = await registrationFormSchema.validate(formValues, {
                abortEarly: false,
            });

            const cleanData = {
                ...validatedData,
                fullname: validatedData.fullname.trim(),
                disease: validatedData.disease.trim(),
            };

            // Clear localStorage after submission
            localStorage.removeItem("formValues");

            try {
                const res = await db.exec(`
                    INSERT INTO patients (fullname, age, contact, disease, gender)
                    VALUES (
                        '${cleanData.fullname}',
                        ${cleanData.age},
                        '${cleanData.contact}',
                        '${cleanData.disease}',
                        '${cleanData.gender}'
                        )
                `);

                if (res) setFormValues(initialFormState);

                alert("Data saved");
            } catch (error) {
                console.log("Error", error);
            }
        } catch (error) {
            if (error.inner) {
                const formattedErrors = {};
                error.inner.forEach((validationError) => {
                    formattedErrors[validationError.path] = validationError.message;
                });
                setErrors(formattedErrors);
            }
        }
    };

    return (
        <section aria-labelledby="form-title" className="px-4 py-10">
            <form
                onSubmit={submitHandler}
                className="flex flex-col border border-gray-300 rounded-2xl p-6 pt-4 max-w-2xl w-full mx-auto capitalize bg-white shadow-sm"
                aria-label="Patient Registration Form"
            >
                <div className="mb-4">
                    <h1 id="form-title" className="text-2xl text-center font-semibold">
                        Patient Registration Form
                    </h1>
                </div>

                {/* Fullname */}
                <div className="mb-4">
                    <label htmlFor="fullname" className="block mb-1">
                        Full-Name:
                    </label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={formValues.fullname}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="off"
                        aria-label="Full Name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-green-500 focus:outline-1"
                    />
                    {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
                </div>

                {/* Age and Contact */}
                <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                        <label htmlFor="age" className="block mb-1">
                            Age:
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formValues.age}
                            onChange={handleChange}
                            placeholder="Your age (number)"
                            autoComplete="off"
                            aria-label="Age"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-green-500 focus:outline-1"
                        />
                        {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                    </div>
                    <div className="w-full md:w-2/3">
                        <label htmlFor="contact" className="block mb-1">
                            Contact Number:
                        </label>
                        <input
                            type="tel"
                            id="contact"
                            name="contact"
                            value={formValues.contact}
                            onChange={handleChange}
                            placeholder="Add your contact number"
                            autoComplete="off"
                            aria-label="Contact Number"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-green-500 focus:outline-1"
                        />
                        {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                    </div>
                </div>

                {/* Disease */}
                <div className="mb-4">
                    <label htmlFor="disease" className="block mb-1">
                        Disease:
                    </label>
                    <input
                        type="text"
                        id="disease"
                        name="disease"
                        value={formValues.disease}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="Describe the condition"
                        aria-label="Disease"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-green-500 focus:outline-1"
                    />
                    {errors.disease && <p className="text-red-500 text-xs mt-1">{errors.disease}</p>}
                </div>

                {/* Gender */}
                <fieldset className="mb-4 border border-gray-300 rounded-md p-3" aria-labelledby="gender-label">
                    <legend id="gender-label" className="font-medium">
                        Gender:
                    </legend>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 pt-2">
                        {["male", "female", "other"].map((g) => (
                            <label key={g} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value={g}
                                    checked={formValues.gender === g}
                                    onChange={handleChange}
                                    className="w-5 h-5 cursor-pointer"
                                    aria-label={g}
                                />
                                <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                            </label>
                        ))}
                    </div>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </fieldset>

                <div>
                    <button
                        type="submit"
                        className="bg-green-500 text-black p-2 w-full rounded-md cursor-pointer hover:bg-green-600 transition-colors"
                        aria-label="Submit Patient Registration Form"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </section>
    );
};

export default RegistrationForm;
