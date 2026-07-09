import * as yup from "yup";
import { useI18n } from "vue-i18n";
import { setLocale } from "yup";

export const useValidationSchema = () => {
    const { t } = useI18n();

    setLocale({
        mixed: {
            required: ({ label }) =>
                t("validation.required_with_label", { field: label }),
        },
        string: {
            min: ({ label, min }) => t("validation.min", { field: label, min }),
            max: ({ label, max }) => t("validation.max", { field: label, max }),
        },
    });

    // required

    const required = (labelKey: string) =>
        yup
            .string()
            .required(
                t("validation.required_with_label", { field: t(labelKey) }),
            );

    const phoneNumber = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.mobile_number"),
                }),
            )
            .matches(
                /^[1-9][0-9]*$/,
                t("validation.phone_only_digits_no_zero_at_start"),
            )
            .min(9, t("validation.minNum", { field: label, min: 9 }))
            .max(10, t("validation.maxNum", { field: label, max: 10 }))
            .label(label);

    const identityNumber = yup
        .string()
        .trim()
        .required(t("validation.required"))
        .matches(
            /^\d{10,20}$/,
            t("subscribe.validation.identity_number_between_10_and_20_digits"),
        )
        .label(t("subscribe.identity_number"));

    // wallet charge amount must be number
    const chargeAmount = yup
        .string()
        .required(t("validation.required"))
        .matches(/^[0-9]+$/, t("validation.charge_amount_only_digits"))
        .label(t("wallet.charge_amount"));

    // OTP Schema 4 numbers
    const otpCode = yup
        .string()
        .required(t("validation.otp_required"))
        .matches(/^\d{4}$/, t("validation.otp_must_be_4_digits"));

    // last name
    const lastnameee = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("validation.lastnameee"),
                }),
            )
            .min(
                3,
                t("validation.lastnameee") +
                    " " +
                    t("validation.min", { field: label, min: 3 }),
            )
            .max(
                10,
                t("validation.lastnameee") +
                    " " +
                    t("validation.max", { field: label, max: 10 }),
            );

    // Full Name Schema

    const fullName = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("validation.fullName"),
                }),
            )
            .min(
                3,
                t("validation.fullName") +
                    " " +
                    t("validation.min", { field: label, min: 3 }),
            )
            .max(
                50,
                t("validation.fullName") +
                    " " +
                    t("validation.max", { field: label, max: 50 }),
            )
            .label(label);

    // Email Schema
    const email = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", { field: t("Auth.email") }),
            )
            .matches(
                /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/,
                t("validation.email", { field: label }),
            )
            .email(t("validation.email", { field: label }));

    // iban Schema
    const iban = (label: string) =>
        yup
            .string()
            .trim()
            .min(
                26,
                t("Auth.iban") +
                    " " +
                    t("validation.min", { field: label, min: 26 }),
            )
            .max(
                26,
                t("Auth.iban") +
                    " " +
                    t("validation.max", { field: label, max: 26 }),
            )
            // .matches(/^[0-9]+$/, t('validation.iban_only_digits'))
            .label(label);

    // tax registration number Schema
    const taxNumber = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t(label),
                }),
            )
            .min(
                10,
                t(label) +
                    " " +
                    t("validation.min_num", { field: t(label), min: 10 }),
            )
            // .matches(/^[0-9]+$/, t('validation.tax_reg_number_only_digits'))
            .label(t(label));

    // commercial number Schema
    const commerciaRumber = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t(label),
                }),
            )
            .min(
                10,
                t(label) +
                    " " +
                    t("validation.min_num", { field: t(label), min: 10 }),
            )
            // .matches(/^[0-9]+$/, t('validation.commercial_reg_number_only_digits'))
            .label(t(label));

    // bank name Schema
    const bankName = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.bank_name"),
                }),
            )
            .min(
                2,
                t("Auth.bank_name") +
                    " " +
                    t("validation.min", { field: label, min: 2 }),
            )
            .label(label);

    // account number Schema
    const accountNumber = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.account_number"),
                }),
            )
            .min(
                10,
                t("Auth.account_number") +
                    " " +
                    t("validation.min_num", { field: label, min: 10 }),
            )
            .max(
                24,
                t("Auth.account_number") +
                    " " +
                    t("validation.max_num", { field: label, max: 24 }),
            )
            .matches(/^[0-9]+$/, t("validation.account_number_only_digits"))
            .label(label);

    // account holder name Schema
    const accountHolderName = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.account_holder_name"),
                }),
            )
            .min(
                3,
                t("Auth.account_holder_name") +
                    " " +
                    t("validation.min", { field: label, min: 3 }),
            )
            .label(label);

    // Select Gender Schema
    const gender = yup
        .object()
        .required(t("validation.required"))
        .label(t("auth.gender"));

    // message text
    const message = yup
        .string()
        .trim()
        .required(t("validation.required"))
        .label(t("contact.message_text"));

    // complaint reason text
    const complaintReason = yup
        .string()
        .trim()
        .required(t("validation.required"))
        .max(50, t("validation.max", { max: 50 }))
        .label(t("complaints.complaint_reason"));

    // complaint description text
    const complaintDescription = yup
        .string()
        .trim()
        .required(t("validation.required"))
        .max(500, t("validation.max", { max: 500 }))
        .label(t("complaints.complaint_description"));

    // Checkbox Schema (for terms and conditions, agreements, etc.)
    const checkbox = (labelKey: string) =>
        yup
            .boolean()
            .required(
                t("validation.required_with_label", { field: t(labelKey) }),
            )
            .oneOf(
                [true],
                t("validation.required_with_label", { field: t(labelKey) }),
            )
            .label(t(labelKey));

    // Radio Button Schema (for gender, preferences, etc.)
    const radioButton = (labelKey: string) =>
        yup
            .string()
            .required(
                t("validation.required_with_label", { field: t(labelKey) }),
            )
            .label(t(labelKey));

    // Multiple Checkboxes Schema (for interests, skills, etc.)
    const multipleCheckboxes = (labelKey: string, minRequired: number = 1) =>
        yup
            .array()
            .min(
                minRequired,
                t("validation.required_with_select", { field: t(labelKey) }),
            )
            .required()
            .label(t(labelKey));

    // Password Schema
    const password = (labelKey: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", { field: t(labelKey) }),
            )
            .min(
                6,
                t("Auth.password") +
                    " " +
                    t("validation.min_pass", { field: t(labelKey), min: 6 }),
            )
            .max(
                30,
                t("Auth.password") +
                    " " +
                    t("validation.max_pass", { field: t(labelKey), max: 30 }),
            )
            .label(t(labelKey));

    // Job Title Schema
    const jobTitle = (labelKey: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", { field: t(labelKey) }),
            )
            .min(3, t("validation.min", { field: t(labelKey), min: 3 }))
            .max(100, t("validation.max", { field: t(labelKey), max: 100 }))
            .label(t(labelKey));

    // Customer Name Schema (same as fullName but with different label)
    const customerName = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t(label),
                }),
            )
            .min(
                3,
                t(label) +
                    " " +
                    t("validation.min", { field: t(label), min: 3 }),
            )
            .max(
                50,
                t(label) +
                    " " +
                    t("validation.max", { field: t(label), max: 50 }),
            )
            .label(t(label));

    // provider name
    const providerName = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t(label),
                }),
            )
            .min(
                3,
                t(label) +
                    " " +
                    t("validation.min", { field: t(label), min: 3 }),
            )
            .max(
                50,
                t(label) +
                    " " +
                    t("validation.max", { field: t(label), max: 50 }),
            )
            .label(t(label));

    // Project Description Schema
    const Notes = (labelKey: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", { field: t(labelKey) }),
            )
            .min(3, t("validation.min", { field: t(labelKey), min: 3 }))
            .max(500, t("validation.max", { field: t(labelKey), max: 500 }))
            .label(labelKey);

    const projectDescription_ar = (labelKey: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.project_desc_ar"),
                }),
            )
            .min(
                3,
                t("validation.min", {
                    field: t("Auth.project_desc_ar"),
                    min: 3,
                }),
            )
            .max(
                500,
                t("validation.max", {
                    field: t("Auth.project_desc_ar"),
                    max: 500,
                }),
            )
            .label(t("Auth.project_desc_ar"));

    const projectDescription_en = (labelKey: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.project_desc_en"),
                }),
            )
            .min(
                3,
                t("validation.min", {
                    field: t("Auth.project_desc_en"),
                    min: 3,
                }),
            )
            .max(
                500,
                t("validation.max", {
                    field: t("Auth.project_desc_en"),
                    max: 500,
                }),
            )
            .label(t("Auth.project_desc_en"));

    const tableDescription_ar = (labelKey: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.table_desc_ar"),
                }),
            )
            .min(
                3,
                t("validation.min", { field: t("Auth.table_desc_ar"), min: 3 }),
            )
            .max(
                500,
                t("validation.max", {
                    field: t("Auth.table_desc_ar"),
                    max: 500,
                }),
            )
            .label(t("Auth.table_desc_ar"));

    const tableDescription_en = (labelKey: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.table_desc_en"),
                }),
            )
            .min(
                3,
                t("validation.min", { field: t("Auth.table_desc_en"), min: 3 }),
            )
            .max(
                500,
                t("validation.max", {
                    field: t("Auth.table_desc_en"),
                    max: 500,
                }),
            )
            .label(t("Auth.table_desc_en"));

    // table number
    const tableNumber = (label: string) =>
        yup
            .string()
            .trim()
            .min(3, label + " " + t("validation.min", { field: label, min: 3 }))
            .max(
                200,
                label + " " + t("validation.max", { field: label, max: 200 }),
            )
            .label(label);

    // table number of people
    const numberOfPeople = (label: string) =>
        yup
            .string()
            .trim()
            .required(t("validation.required_with_label", { field: label }))
            .matches(/^[1-9][0-9]*$/, t("Table.number_of_people"))
            .max(3, label + " " + t("tables.max", { field: label, max: 3 }))
            .label(label);

    // reservation duration number (similar to numberOfPeople but with proper translation)
    const reservationDuration = (labelKey: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", { field: t(labelKey) }),
            )
            .matches(
                /^[1-9][0-9]*$/,
                t("validation.reservation_duration_digits"),
            )
            .max(
                3,
                t(labelKey) +
                    " " +
                    t("tables.max", { field: t(labelKey), max: 3 }),
            )
            .label(t(labelKey));

    // table booking price
    const bookingPrice = (label: string) =>
        yup
            .string()
            .trim()
            .required(t("validation.required_with_label", { field: label }))
            .matches(
                /^[0-9]+$/,
                t("validation.booking_price_only_digits", { field: label }),
            )
            .min(2, label + " " + t("tables.min", { field: label, min: 2 }))
            .max(6, label + " " + t("tables.max", { field: label, max: 6 }))
            .label(label);

    // Menu Name Ar Schema
    const menuNameAr = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.menu_name_ar"),
                }),
            )
            .min(
                3,
                t("Auth.menu_name_ar") +
                    " " +
                    t("validation.min", { field: label, min: 3 }),
            )
            .max(
                50,
                t("Auth.menu_name_ar") +
                    " " +
                    t("validation.max", { field: label, max: 50 }),
            )
            .label(label);

    // Menu Name En Schema
    const menuNameEn = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.menu_name_en"),
                }),
            )
            .min(
                3,
                t("Auth.menu_name_en") +
                    " " +
                    t("validation.min", { field: label, min: 3 }),
            )
            .max(
                50,
                t("Auth.menu_name_en") +
                    " " +
                    t("validation.max", { field: label, max: 50 }),
            )
            .label(label);

    // Menu Description Ar Schema
    const menuDescriptionAr = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.menu_description_ar"),
                }),
            )
            .min(
                3,
                t("Auth.menu_description_ar") +
                    " " +
                    t("validation.min", { field: label, min: 3 }),
            )
            .max(
                500,
                t("Auth.menu_description_ar") +
                    " " +
                    t("validation.max", { field: label, max: 500 }),
            )
            .label(label);

    // Menu Description En Schema
    const menuDescriptionEn = (label: string) =>
        yup
            .string()
            .trim()
            .required(
                t("validation.required_with_label", {
                    field: t("Auth.menu_description_en"),
                }),
            )
            .min(
                3,
                t("Auth.menu_description_en") +
                    " " +
                    t("validation.min", { field: label, min: 3 }),
            )
            .max(
                500,
                t("Auth.menu_description_en") +
                    " " +
                    t("validation.max", { field: label, max: 500 }),
            )
            .label(label);

    const date = (label: string) => yup.string().required(`${label} مطلوب`);

    const time = (label: string) => yup.string().required(`${label} مطلوب`);

    return {
        required,
        phoneNumber,
        otpCode,
        fullName,
        customerName,
        providerName,
        projectDescription_ar,
        projectDescription_en,
        email,
        gender,
        message,
        chargeAmount,
        complaintReason,
        complaintDescription,
        identityNumber,
        lastnameee,
        iban,
        checkbox,
        radioButton,
        multipleCheckboxes,
        password,
        jobTitle,
        commerciaRumber,
        taxNumber,
        bankName,
        accountNumber,
        accountHolderName,
        tableNumber,
        numberOfPeople,
        reservationDuration,
        bookingPrice,
        Notes,
        menuNameAr,
        menuNameEn,
        menuDescriptionAr,
        menuDescriptionEn,
        tableDescription_ar,
        tableDescription_en,
        date,
        time,
    };
};
