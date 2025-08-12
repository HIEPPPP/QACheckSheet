import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    content,
    onConfirm,
    onCancel,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Hủy</Button>
                <Button onClick={onConfirm} variant="contained" color="error">
                    Xác Nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
