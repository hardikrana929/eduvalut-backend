// const con = require("../config/db");

// const uploadPdf = async (req, res) => {
//   try {
//     const { title, branchId, semesterId } = req.body;
//     if (!req.file) {
//       return res.status(400).json({
//         message: "PDF file require",
//       });
//     }
//     //cloudinary path
//     const pdfUrl = req.file.path;
//     const uploadedBy = req.user.id; //Admin id

//     const inQuery = `insert into syllabus (title,branch_id,semester_id,pdf_url,uploaded_by)
//         values(?,?,?,?,?);
//     `;
//     await con.query(inQuery, [title, branchId, semesterId, pdfUrl, uploadedBy]);
//     return res.status(201).json({
//       message: "Pdf uploaded successfully.",
//     })

//   } catch (error) {
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// module.exports = { uploadPdf };

// // {
// //   "title":"React unit 1",
// //   "branchId":"1",
// //   "semesterId":"6",
// //   "uploadedBy":"1",
// // }
const con = require("../config/db");
const supabase = require("../config/supabase");
//Upload syllabus pdf 
// try {
//   const { title, branchId, semesterId, syllabusType } = req.body;
//   if (!req.file) {
//     return res.status(400).json({ message: "PDF file required" });
//   }

//   // Construct the URL pointing back to your server domain
//   // Example output: http://localhost:5000/uploads/pdfs/filename-12345.pdf
//   const pdfUrl = `${req.protocol}://${req.get("host")}/uploads/pdfs/${req.file.filename}`;
//   const uploadedBy = req.user.id;

//   const inQuery = `INSERT INTO syllabus (title, branch_id, semester_id, pdf_url, uploaded_by,syllabus_type) VALUES (?, ?, ?, ?, ?,?);`;
//   await con.query(inQuery, [title, branchId, semesterId, pdfUrl, uploadedBy, syllabusType]);

//   return res.status(201).json({
//     message: "Pdf saved to server storage successfully.",
//     url: pdfUrl
//   });
// } catch (error) {
//   return res.status(500).json({ message: "Server error", error: error.message });
// }
const uploadPdf = async (req, res) => {
  try {
    const { title, branchId, semesterId, syllabusType } = req.body;
    const uploadedBy = req.user.id;
    if (!title || !branchId || !semesterId || !syllabusType || !uploadedBy) {
      return res.status(400).json({ message: "All Fields are required." });
    }
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const cleanName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    const fileName = `${Date.now()}-${cleanName}`;

    const { data, error } = await supabase.storage
      .from("pdfs")
      .upload(fileName, file.buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
    const { data: publicUrlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(fileName);

    const pdfUrl = publicUrlData.publicUrl;

    const inQuery = `
      INSERT INTO syllabus
      (title, branch_id, semester_id, pdf_url, uploaded_by, syllabus_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await con.query(
      inQuery,
      [title, branchId, semesterId, pdfUrl, uploadedBy, syllabusType]
    );

    return res.status(201).json({
      success: true,
      pdfUrl,
    });

  } catch (error) {
    console.error('[controllerName.functionName]', error); // server log only
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

//Update Pdfs
const updatePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, branchId, semesterId, syllabusType } = req.body;
    const uploadedBy = req.user.id;
    if (!title || !branchId || !semesterId || !syllabusType || !uploadedBy) {
      return res.status(400).json({ message: "All Fields are required." });
    }
    // 1. Prevent Foreign Key Error: Check if the user (uploaded_by) actually exists
    const [userCheck] = await con.query("select id from users where id = ?", [uploadedBy]);
    if (userCheck.length === 0) {
      return res.status(400).json({
        message: "Invalid User: The user ID provided for 'uploadedBy' does not exist."
      });
    }

    // 2. Prevent Duplicate Error: Check if another syllabus already uses this exact combination
    // Adjust the WHERE clause based on what makes a syllabus "duplicate" in your app (e.g., same title, or same branch + semester)
    const duplicateQuery = `
        select id from syllabus 
        where title = ? AND branch_id = ? AND semester_id = ? AND id != ?
      `;
    const [duplicateCheck] = await con.query(duplicateQuery, [title, branchId, semesterId, id]);

    if (duplicateCheck.length > 0) {
      return res.status(400).json({
        message: "Duplicate Entry: A syllabus with this title for the selected branch and semester already exists."
      });
    }

    // 3. If both checks pass, safely proceed with the update
    const upQuery = `update syllabus set 
        title=?, branch_id=?, semester_id=?, uploaded_by=?, syllabus_type=?
        where id=?
      `;

    await con.query(upQuery, [title, branchId, semesterId, uploadedBy, syllabusType, id]);

    return res.status(200).json({
      message: "Syllabus PDF Updated.",
    });

  } catch (error) {
    console.error('[controllerName.functionName]', error); // server log only
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

//Get syllabus pdf
const getPdfs = async (req, res) => {
  try {
    const squery = `
      SELECT 
        syllabus.*,
        branches.branch_name,
        semesters.semester_name,
        users.fullname
      FROM syllabus
      JOIN branches 
        ON syllabus.branch_id = branches.id
      JOIN semesters 
        ON syllabus.semester_id = semesters.id
      JOIN users 
        ON users.id = syllabus.uploaded_by
    `;
    const [result] = await con.query(squery);
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error('[controllerName.functionName]', error); // server log only
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

//Get one syllabus pdf
const getOnePdfs = async (req, res) => {
  try {
    const { id } = req.params;
    const oneSelect = `select * from syllabus where id=?`;
    const [result] = await con.query(oneSelect, [id]);
    return res.status(200).json({
      data: result,
    })
  } catch (error) {
    console.error('[controllerName.functionName]', error); // server log only
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }

}

//Delete pdf
const deletePdf = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "All Fields are required." });
    }
    const [isPaper] = await con.query(
      "select * from syllabus where id=?",
      [id]
    );

    if (isPaper.length === 0) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    const pdfUrl = isPaper[0].pdf_url;

    // GET FILE NAME
    const fname = pdfUrl.split("/pdfs/")[1];

    console.log(fname);

    // DELETE FROM SUPABASE
    const { error } = await supabase.storage
      .from("pdfs")
      .remove([fname]);

    if (error) {
      return res.status(500).json({
        message: "Supabase file delete fail.",
        error: error.message,
      });
    }

    // DELETE FROM DATABASE
    await con.query(
      "delete from syllabus where id=?",
      [id]
    );

    return res.status(200).json({
      message: "Material PDF Removed successfully.",
    });

  } catch (error) {
    console.error('[controllerName.functionName]', error); // server log only
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  };
}
module.exports = { uploadPdf, getPdfs, updatePdf, getOnePdfs, deletePdf };