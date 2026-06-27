const con = require("../config/db");
const supabase = require("../config/supabase");

//Upload papers
const uploadPaper = async (req, res) => {
    try {
        const { subjectName, branchId, semesterId, year, uploadedBy } = req.body;
        const pdfs = req.file;
        if (!subjectName || !branchId || !semesterId || !year || !uploadedBy) {
            return res.status(400).json({ message: "All Fields are required." });
        }
        if (!pdfs) {
            return res.status(400).json({
                message: "No file Uploaded.",
            })
        }
        const cleanName = pdfs.originalname
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9.-]/g, "");

        const fileName = `${Date.now()}-${cleanName}`;
        const { data, error } = await supabase.storage
            .from("pdfs")
            .upload(fileName, pdfs.buffer, {
                contentType: "application/pdf",
                upsert: false,
            });
        if (error) {
            return res.status(500).json({
                message: error.message,
            })
        }
        const { data: publicUrlData } = supabase.storage.from("pdfs").getPublicUrl(fileName);
        const pdfUrl = publicUrlData.publicUrl;
        const inQuery = `insert into papers (subject_name,branch_id,semester_id,year,pdf_url,uploaded_by) 
    values(?,?,?,?,?,?)`;

        await con.query(inQuery, [subjectName, branchId, semesterId, year, pdfUrl, uploadedBy]);
        return res.status(200).json({
            message: "Paper uploaded successfully."
        });

    } catch (error) {
        console.error('[controllerName.functionName]', error); // server log only
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
}

//Update papers 
const updatePaper = async (req, res) => {
    try {
        const { id } = req.params;
        const { subjectName, branchId, semesterId, year, uploadedBy } = req.body;
        if (!subjectName || !branchId || !semesterId || !year || !uploadedBy) {
            return res.status(400).json({ message: "All Fields are required." });
        }
        //Check admin user exist
        const [adminUser] = await con.query(`select * from users where id = ?`, [uploadedBy]);
        if (adminUser.length === 0) {
            return res.status(400).json({
                message: "Invalid User: The user ID provided for 'uploadedBy' does not exist."
            })
        }

        //Check duplicate paper exsit in database
        const duplicateQuery = `
      select id from papers 
      where subject_name = ? AND branch_id = ? AND semester_id = ? AND id != ?
    `;
        const [duplicateCheck] = await con.query(duplicateQuery, [subjectName, branchId, semesterId, id]);

        if (duplicateCheck.length > 0) {
            return res.status(400).json({
                message: "Duplicate Entry: A paper with this subject already exists."
            });
        }
        const upQuery = `update papers set 
      subject_name=?, branch_id=?, semester_id=?, year=?, uploaded_by=?
      where id=?`;

        await con.query(upQuery, [subjectName, branchId, semesterId, year, uploadedBy, id]);

        return res.status(200).json({
            message: "Paper Updated Successfully."
        });

    } catch (error) {
        console.error('[controllerName.functionName]', error); // server log only
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
}

//Get Papers
const getAllPapers = async (req, res) => {
    try {
        const query = `select papers.*,branches.branch_name, semesters.semester_name,users.fullname from 
        papers JOIN branches on papers.branch_id = branches.id
        JOIN semesters on semesters.id = papers.semester_id
        JOIN users on users.id = papers.uploaded_by
         `;
        const [result] = await con.query(query);
        return res.status(200).json({
            data: result,
        })

    } catch (error) {
        console.error('[controllerName.functionName]', error); // server log only
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
}

//Get one papers
const getOnePaper = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `select * from papers where id=?`;
        const [result] = await con.query(query, [id]);
        return res.status(200).json({
            data: result
        });

    } catch (error) {
        console.error('[controllerName.functionName]', error); // server log only
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
}

//Delete Paper
const deletePaper = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "All Fields are required." });
        }
        // Get paper details first
        const [paper] = await con.query(
            `select * from papers where id=?`,
            [id]
        );

        if (paper.length === 0) {
            return res.status(404).json({
                message: "Paper not found."
            });
        }

        // Get PDF URL
        const pdfUrl = paper[0].pdf_url;

        // Extract filename from URL
        const fileName = pdfUrl.split("/").pop();

        // Delete from Supabase Storage
        const { error } = await supabase.storage
            .from("pdfs")
            .remove([fileName]);

        if (error) {
            return res.status(500).json({
                message: "Supabase file delete failed.",
                error: error.message,
            });
        }

        // Delete from database
        await con.query(
            `delete from papers where id=?`,
            [id]
        );

        return res.status(200).json({
            message: "Paper deleted successfully.",
        });

    } catch (error) {
        console.error('[controllerName.functionName]', error); // server log only
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};
module.exports = { uploadPaper, updatePaper, getAllPapers, getOnePaper, deletePaper };


