import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  ReactNode,
} from "react";
import {
  Button,
  Box,
  IconButton,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import api from "../../utils/Api";

// ================================
// Types
// ================================

type DialogStatus = "WARNING" | "ERROR" | "INFO" | "QUESTION" | "DELETE";

interface DisplayMsgDialogProps {
  open: boolean;
  onClose: () => void;
  setDesc?: (v: string) => void;
  resourceId?: string | number;
  resourceKey?: string;
  description?: string;
  getResource?: boolean;
  status?: DialogStatus;
  children?: ReactNode;
  onAction?: () => void | Promise<void>;
  actionLabel?: string;
  actionColor?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success";
    

}

interface Details {
  resource_type: string;
  text: string;
}

// ================================
// Constants
// ================================

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
});

const STATUS_ICONS: Record<string, JSX.Element> = {
  WARNING: <WarningIcon fontSize="large" />,
  QUESTION: <HelpOutlineIcon fontSize="large" />,
  ERROR: <ErrorIcon fontSize="large" />,
  INFO: <InfoIcon fontSize="large" />,
  DELETE: <DeleteForeverIcon fontSize="large" />,
};

const STATUS_STYLES: Record<string, object> = {
  WARNING: {
    bgcolor: "#fff3e0",
    borderLeft: "4px solid #ff9800",
    color: "#e65100",
  },

  QUESTION: {
    bgcolor: "#f3e5f5",
    borderLeft: "4px solid #9c27b0",
    color: "#7b1fa2",
  },

  ERROR: {
    bgcolor: "#ffebee",
    borderLeft: "4px solid #f44336",
    color: "#c62828",
  },

  "ERROR while fetching details": {
    bgcolor: "#ffebee",
    borderLeft: "4px solid #f44336",
    color: "#c62828",
  },

  INFO: {
    bgcolor: "#e3f2fd",
    borderLeft: "4px solid #2196f3",
    color: "#1565c0",
  },

  DELETE: {
    bgcolor: "#ffebee",
    borderLeft: "4px solid #f44336",
    color: "#c62828",
  },
};

// ================================
// Helpers
// ================================

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");

    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);

    textarea.select();

    const success = document.execCommand("copy");

    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    console.error("Clipboard copy failed:", error);
    return false;
  }
};

// ================================
// Memoized Components
// ================================

const LoadingOverlay = memo(function LoadingOverlay() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "loadingBg",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
      }}
    >
      <CircularProgress />
    </Box>
  );
});

interface DescriptionSectionProps {
  description: string;
  copied: boolean;
  onCopy: () => void;
}

const DescriptionSection = memo(function DescriptionSection({
  description,
  copied,
  onCopy,
}: DescriptionSectionProps) {
  const formattedDescription = useMemo(() => {
    return description.split("; ").join("\n\n");
  }, [description]);

  const marginTop = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL?.endsWith("/") ? 4 : 2;
  }, []);

  return (
    <>
      <Typography sx={{ mt: 1, color: "black" }}>
        Additional Information
      </Typography>

      <Box
        sx={{
          mt: marginTop,
          position: "relative",
          pb: 1,
          maxHeight: "50vh",
          overflow: "auto",
          borderBottom: "1px solid gray",
        }}
      >
        <Typography
          sx={{
            whiteSpace: "pre-line",
            color: "black",
            pr: 4,
          }}
          dangerouslySetInnerHTML={{
            __html: formattedDescription,
          }}
        />

        <Tooltip
          title={copied ? "Copied!" : "Copy to clipboard"}
          arrow
          placement="top"
        >
          <IconButton
            onClick={onCopy}
            size="small"
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: 0,
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
});

// ================================
// Main Component
// ================================

function DisplayMsgDialogComponent({
  open,
  onClose,
  resourceId,
  resourceKey = undefined,
  description,
  setDesc,
  getResource = true,
  status,
  children,
  onAction,
  actionLabel = "Confirm",
  actionColor = "primary",
}: DisplayMsgDialogProps) {
  const [details, setDetails] = useState<Details | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ================================
  // Memoized Values
  // ================================

  const isQuestion = useMemo(() => {
    return details?.resource_type === "QUESTION";
  }, [details?.resource_type]);

  const statusStyles = useMemo(() => {
    if (!details) return {};

    return STATUS_STYLES[details.resource_type] ?? {};
  }, [details]);

  const statusIcon = useMemo(() => {
    if (!details?.resource_type) return null;

    return STATUS_ICONS[details.resource_type] ?? null;
  }, [details?.resource_type]);

  const titleText = useMemo(() => {
    if (resourceId && !isNaN(+resourceId)) {
      return `${details?.resource_type || ""} - ${Math.abs(+resourceId)}`;
    }
    /*
     * here it depends on resource key as a second option for displaying title this goes against all the component
     * but it is made like that since resource key is more cryptic
     */
    if (resourceKey) {
      return `${details?.resource_type || ""} - ${Math.abs(+resourceKey)}`;
    }
    return details?.resource_type || "ERROR";
  }, [details?.resource_type, resourceId, resourceKey]);

  // ================================
  // Handlers
  // ================================

  const resetStates = useCallback(() => {
    setDetails(null);
    setError(null);

    if (setDesc) {
      setDesc("");
    }
  }, [setDesc]);

  const handleClose = useCallback(() => {
    onClose();

    setTimeout(() => {
      document.body.style.overflow = "unset";
    }, 100);
  }, [onClose]);

  const handleCopy = useCallback(async () => {
    if (!description) return;

    const plainText = description.replace(/<[^>]*>/g, "");

    const success = await copyToClipboard(plainText);

    setCopied(success);

    if (success) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [description]);

  const handleAction = useCallback(async () => {
    if (!onAction) return;

    try {
      setActionLoading(true);
      await onAction();
    } finally {
      setActionLoading(false);
    }
  }, [onAction]);

  // ================================
  // API
  // ================================

  const fetchDetails = useCallback(
    async ({
      id,
      resourceKey,
    }: {
      id?: string | number;
      resourceKey?: string;
    }) => {
      if (!getResource) {
        if (status) {
          setDetails({
            text: "",
            resource_type: status,
          });
        }

        return;
      }

      if (!resourceKey && (id == null || isNaN(Number(id)) || id === "")) {
        setDetails({
          text: "Please contact admin",
          resource_type: "ERROR",
        });

        return;
      }

      try {
        setLoading(true);

        const parsedId = Math.abs(Number(id));
        let resourseData;
        if (resourceKey) {
          const { data } = await api.get(`/api/resource/`, {
            timeout: 10000,
            params: { resourceKey },
          });
          resourseData = data;
        } else {
          const { data } = await api.get(`/api/resource/${parsedId}`, {
            timeout: 10000,
          });
          resourseData = data;
        }

        setDetails(
          resourseData?.data || {
            text: `There is no details available for this ${resourceKey ? "resuurceKey" : "resourceId"} ${resourceKey || resourceId}`,
            resource_type: "ERROR",
          },
        );

        setError(null);
      } catch (error) {
        console.error(error);

        setDetails({
          text: `There is no details available for this ${resourceKey ? "resuurceKey" : "resourceId"} ${resourceKey || resourceId}`,
          resource_type: "ERROR",
        });
      } finally {
        setLoading(false);
      }
    },
    [getResource, status],
  );

  // ================================
  // Effects
  // ================================

  useEffect(() => {
    if (!open) return;

    fetchDetails({ id: resourceId, resourceKey });
  }, [open, resourceId, resourceKey, fetchDetails]);

  // ================================
  // Render
  // ================================

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        onClose={(_, reason) => {
          if (reason === "backdropClick") return;

          handleClose();
        }}
        slotProps={{
          transition: {
            onExited: resetStates,
          },
        }}
      >
        <Box sx={statusStyles}>
          {/* ================= Title ================= */}

          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={2}>
                {statusIcon}

                <Typography variant="h6">{titleText}</Typography>
              </Box>

              <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          {/* ================= Content ================= */}

          <DialogContent dividers>
            {error && <Typography color="error">{error}</Typography>}

            {details?.text && <Typography>{details.text}</Typography>}

            {description && (
              <DescriptionSection
                description={description}
                copied={copied}
                onCopy={handleCopy}
              />
            )}

            {children && <Box sx={{ mt: 2 }}>{children}</Box>}
          </DialogContent>

          {/* ================= Actions ================= */}

          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              {isQuestion && onAction ? "Cancel" : "Close"}
            </Button>

            {onAction && (
              <Button
                variant="contained"
                color={actionColor}
                onClick={handleAction}
                disabled={actionLoading}
                startIcon={
                  actionLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {actionLabel}
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
}

export const DisplayMsgDialog = memo(DisplayMsgDialogComponent);
