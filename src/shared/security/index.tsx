import GLButton from "./GLButton";
import GLGenericButton from "./GLGenericButton";
import GLIconButton from "./GLIconButton";
import GLTextField from "./GLTextField";
import GlCustomTable from "./GLCustomTable";
import GLLabelAndField from "./GLLabelAndField";
import GLTab from "./GLTab";
import GLFormControlLabel from "./GLFormControlLabel";
import GLExportButton from "./GLExportButton";
import GLTypography from "./GLTypography";
import GLDatePicker from "./GLDatePicker";
import GLTableCell from "./GLTableCell";
import GLGenericFormControlLabel from "./GLGenericFormControlLabel";
import GLTabPanel from "./GLTabPanel";
import GLFormControl from "./GLFormControl";
import GLTooltip from "./GLTooltip";
// Secure form components — standalone + Formik-integrated variants with permission enforcement
import SecureForms from "./secure.form.index";
import GLExcelExportButton from "./GLExcelExportButton";
import GLExcelExportIconButton from "./GLExcelExportIconButton";
import GLExcelImportButton from "./GLExcelImportButton";
import GLButton2 from "./GLButton.2";
import GlCustomTable2 from "./GLCustomTable.v2";
import GLLab from "./GLTab.v2";
import GLTypography2 from "./GLTypography.v2";
import GLSecureInputs from "./GLSecureInputs";
import GLIconButton2 from "./GLIconButton.v2";
import { GLSecureCheckbox } from "./GLSecureCheckbox";
import { GLSecureAutoComplete } from "./GLSecureAutoComplete";

const Secure = {
  // ── UI primitives ──────────────────────────────────────────────────────────
  GLButton,
  GLSecureCheckbox,
  GLSecureAutoComplete,
  GLGenericButton,
  GLIconButton,
  GLTextField,
  GlCustomTable,
  GLLabelAndField,
  GLTab,
  GLFormControlLabel,
  GLExportButton,
  GLTypography,
  GLDatePicker,
  GLTableCell,
  GLTabPanel,
  GLGenericFormControlLabel,
  GLFormControl,
  GLTooltip,
  GLExcelExportButton,
  GLExcelExportIconButton,
  GLExcelImportButton,
  // !!! 
  GLButton2: GLButton2,
  GLCustomTable2: GlCustomTable2,
  GLLab: GLLab,
  GLTypography2: GLTypography2,
  GLSecureInputs: GLSecureInputs,
  GLIconButton2: GLIconButton2, 
  // ── Permission-aware form components (see secure.form.index.tsx) ───────────
  Forms: SecureForms,
};

export default Secure;
